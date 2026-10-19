use anyhow::Result;

use cogit_core::client::{read_provider, wallet_context};
use cogit_core::expiry_days;
use cogit_core::ops::{CommitInput, commit_context, log_context, pull_context};
use cogit_core::render::{render_log_line, short_hex};
use cogit_core::store::read_config;
use cogit_core::types::CommitKind;

use rmcp::{
    ErrorData as McpError, RoleServer, ServerHandler,
    handler::server::{router::tool::ToolRouter, tool::ToolCallContext, wrapper::Parameters},
    model::{
        CallToolRequestParams, CallToolResponse, CallToolResult, ContentBlock, ErrorCode,
        Implementation, ServerCapabilities, ServerConfig,
    },
    service::RequestContext,
    tool, tool_handler, tool_router,
};
use schemars::{JsonSchema, Schema};
use serde::Deserialize;

const MAX_SUMMARY_CHARS: usize = 200;
const MAX_LOG_N: u64 = 100;

/// Removes schemars keys the TS server's zod schemas never emit, keeping
/// `tools/list` payloads equivalent (see the E2E parity checks).
fn ts_schema_cleanup(schema: &mut Schema) {
    if let Some(obj) = schema.as_object_mut() {
        obj.remove("default");
        obj.remove("format");
    }
}

fn zod_style_invalid_args(tool: &str, detail: &str) -> McpError {
    McpError::invalid_params(
        format!("Input validation error: Invalid arguments for tool {tool}: {detail}"),
        None,
    )
}

const COMMIT_TOOL_DESCRIPTION: &str = "Record a durable, encrypted, wallet-signed entry in the team's shared memory on Arkiv, on your current branch. Call this IMMEDIATELY whenever you make or learn a decision someone else will need — architecture choices, API contracts, schema changes, milestones — without waiting to be asked; teammates' agents pull these commits and must be able to follow them. Write details as self-contained markdown. If it fails because the branch belongs to a teammate, create your own branch first (`cogit branch <your-name>` then `cogit use <your-name>`) and retry.";

const PULL_TOOL_DESCRIPTION: &str = "Fetch a branch's team context from Arkiv: every commit that passes verification (hash, wallet signature, entity ownership, repo membership), decrypted and ordered oldest-first, as markdown. Call this BEFORE starting any task a teammate may have specified or decided on (e.g. building a feature or schema their branch names), and follow the returned decisions. Invalid or unverifiable commits are never returned.";

const LOG_TOOL_DESCRIPTION: &str = "List recent commits with their verification status (verified = hash + wallet signature + owner + membership all check out; invalid = never decrypted). Use it to survey team activity, pick the right branch to pull, or confirm your own commits landed.";

#[derive(Debug, Clone, Copy, Deserialize, JsonSchema)]
#[serde(rename_all = "lowercase")]
#[schemars(inline)]
pub enum KindArg {
    Scratch,
    Note,
    Decision,
    Milestone,
}

impl KindArg {
    fn to_kind(self) -> CommitKind {
        match self {
            Self::Scratch => CommitKind::Scratch,
            Self::Note => CommitKind::Note,
            Self::Decision => CommitKind::Decision,
            Self::Milestone => CommitKind::Milestone,
        }
    }
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct CommitArgs {
    /// One-line summary of the decision or note
    #[schemars(extend("minLength" = 1, "maxLength" = 200))]
    pub summary: String,
    /// Markdown body: context, rationale, code snippets, links. Keep it self-contained.
    #[serde(default)]
    #[schemars(with = "String", transform = ts_schema_cleanup)]
    pub details: Option<String>,
    /// Commit kind; decides how long the entry lives (scratch 3d, note 14d, decision 90d, milestone 365d). Default note.
    #[serde(default)]
    #[schemars(with = "KindArg", transform = ts_schema_cleanup)]
    pub kind: Option<KindArg>,
    /// Short tags for filtering, e.g. ['db', 'api']
    #[serde(default)]
    #[schemars(with = "Vec<String>", transform = ts_schema_cleanup)]
    pub tags: Option<Vec<String>>,
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct PullArgs {
    /// Branch to pull — a teammate's branch (e.g. 'anurag') or 'main'
    #[schemars(extend("minLength" = 1))]
    pub branch: String,
    /// Only include commits of this kind
    #[serde(default)]
    #[schemars(with = "KindArg", transform = ts_schema_cleanup)]
    pub kind: Option<KindArg>,
    /// Only include commits carrying this tag
    #[serde(default)]
    #[schemars(with = "String", transform = ts_schema_cleanup)]
    pub tag: Option<String>,
}

#[derive(Debug, Deserialize, JsonSchema)]
pub struct LogArgs {
    /// Only this branch (default: all branches)
    #[serde(default)]
    #[schemars(with = "String", transform = ts_schema_cleanup)]
    pub branch: Option<String>,
    /// Show only the most recent n commits (default all recent)
    #[serde(default)]
    #[schemars(with = "u64", transform = ts_schema_cleanup)]
    #[schemars(extend("minimum" = 1, "maximum" = 100))]
    pub n: Option<u64>,
}

#[derive(Clone)]
pub struct CogitMcp {
    tool_router: ToolRouter<Self>,
}

#[tool_router]
impl CogitMcp {
    pub fn new() -> Self {
        Self {
            tool_router: Self::tool_router(),
        }
    }

    #[tool(
        name = "context_commit",
        title = "Commit team context",
        description = COMMIT_TOOL_DESCRIPTION
    )]
    async fn context_commit(
        &self,
        Parameters(args): Parameters<CommitArgs>,
        ctx: RequestContext<RoleServer>,
    ) -> Result<CallToolResult, McpError> {
        let summary_len = args.summary.chars().count();
        if summary_len == 0 {
            return Err(zod_style_invalid_args(
                "context_commit",
                "Too small: expected string to have >=1 characters at summary",
            ));
        }
        if summary_len > MAX_SUMMARY_CHARS {
            return Err(zod_style_invalid_args(
                "context_commit",
                &format!(
                    "Too big: expected string to have <={MAX_SUMMARY_CHARS} characters at summary"
                ),
            ));
        }

        let result: Result<String> = async {
            let config = read_config()?;
            let wallet = wallet_context()?;
            let commit = commit_context(
                &wallet.provider,
                &wallet.signer,
                &wallet.address,
                &config,
                &CommitInput {
                    message: args.summary,
                    details: args.details.unwrap_or_default(),
                    kind: args.kind.map(KindArg::to_kind).unwrap_or(CommitKind::Note),
                    tags: args.tags.unwrap_or_default(),
                    agent: agent_name(&client_name(&ctx)),
                },
            )
            .await?;
            Ok(format!(
                "committed {} to branch \"{}\" ({}; stored for ~{} days on Arkiv)",
                short_hex(&commit.commit_hash, 14),
                commit.branch,
                commit.kind,
                expiry_days(commit.kind),
            ))
        }
        .await;
        Ok(tool_result(result))
    }

    #[tool(
        name = "context_pull",
        title = "Pull teammate context",
        description = PULL_TOOL_DESCRIPTION
    )]
    async fn context_pull(&self, Parameters(args): Parameters<PullArgs>) -> CallToolResult {
        let result: Result<String> = async {
            let config = read_config()?;
            let provider = read_provider()?;
            let pulled = pull_context(
                &provider,
                &config,
                &args.branch,
                args.kind.map(KindArg::to_kind),
                args.tag.as_deref(),
            )
            .await?;
            let warn = if pulled.members_checked {
                String::new()
            } else {
                format!(
                    "> warning: repo {} was not found on chain, membership was not checked\n\n",
                    config.repo_id
                )
            };
            Ok(format!(
                "{warn}{}\n_({} verified, {} invalid skipped)_",
                pulled.markdown, pulled.verified, pulled.invalid
            ))
        }
        .await;
        tool_result(result)
    }

    #[tool(
        name = "context_log",
        title = "List recent context commits",
        description = LOG_TOOL_DESCRIPTION
    )]
    async fn context_log(
        &self,
        Parameters(args): Parameters<LogArgs>,
    ) -> Result<CallToolResult, McpError> {
        if let Some(n) = args.n {
            if n < 1 {
                return Err(zod_style_invalid_args(
                    "context_log",
                    "Too small: expected number to be >=1 at n",
                ));
            }
            if n > MAX_LOG_N {
                return Err(zod_style_invalid_args(
                    "context_log",
                    &format!("Too big: expected number to be <={MAX_LOG_N} at n"),
                ));
            }
        }

        let result: Result<String> = async {
            let config = read_config()?;
            let provider = read_provider()?;
            let rows = log_context(
                &provider,
                &config,
                args.branch.as_deref(),
                args.n.map(|n| n as usize),
            )
            .await?;
            if rows.is_empty() {
                return Ok("no commits found".to_string());
            }
            Ok(rows
                .iter()
                .map(render_log_line)
                .collect::<Vec<_>>()
                .join("\n"))
        }
        .await;
        Ok(tool_result(result))
    }
}

impl Default for CogitMcp {
    fn default() -> Self {
        Self::new()
    }
}

#[tool_handler(router = self.tool_router)]
impl ServerHandler for CogitMcp {
    fn get_info(&self) -> ServerConfig {
        let mut info = ServerConfig::default();
        info.server_info = Implementation::new("cogit", env!("CARGO_PKG_VERSION"));
        info.capabilities = ServerCapabilities::builder().enable_tools().build();
        info
    }

    async fn call_tool(
        &self,
        request: CallToolRequestParams,
        context: RequestContext<RoleServer>,
    ) -> Result<CallToolResponse, McpError> {
        let tool = request.name.to_string();
        match self
            .tool_router
            .call(ToolCallContext::new(self, request, context))
            .await
        {
            Ok(response) => Ok(normalize_serde_argument_error(&tool, response)),
            Err(err) => Ok(mcp_error_result(&tool, &err)),
        }
    }
}

/// The TS SDK server surfaces tool-call protocol errors as `isError` results
/// ("MCP error -32602: …"), never as JSON-RPC errors; mirror that so clients
/// behave identically against either server.
fn mcp_error_result(tool: &str, err: &McpError) -> CallToolResponse {
    let message = if err.message.as_ref() == "tool not found" {
        format!("Tool {tool} not found")
    } else {
        err.message.to_string()
    };
    CallToolResult::error(vec![ContentBlock::text(format!(
        "MCP error {}: {message}",
        err.code.0
    ))])
    .into()
}

/// rmcp already turns argument-deserialization failures into `isError` results;
/// reword them to the TS SDK's "MCP error … Input validation error …" shape.
fn normalize_serde_argument_error(tool: &str, response: CallToolResponse) -> CallToolResponse {
    const PREFIX: &str = "failed to deserialize parameters:";
    match response {
        CallToolResponse::Complete(mut result) if result.is_error == Some(true) => {
            for block in &mut result.content {
                if let ContentBlock::Text(text) = block
                    && let Some(rest) = text.text.strip_prefix(PREFIX)
                {
                    text.text = format!(
                        "MCP error {}: Input validation error: Invalid arguments for tool {tool}:{rest}",
                        ErrorCode::INVALID_PARAMS.0
                    );
                }
            }
            CallToolResponse::Complete(result)
        }
        other => other,
    }
}

/// Mirrors the TS `run()` wrapper: tool failures become `isError: true` text
/// results (`cogit error: …`), never protocol errors.
fn tool_result(result: Result<String>) -> CallToolResult {
    match result {
        Ok(text) => {
            let mut result = CallToolResult::success(vec![ContentBlock::text(text)]);
            // The TS SDK omits `isError` on success; match it on the wire.
            result.is_error = None;
            result
        }
        Err(err) => CallToolResult::error(vec![ContentBlock::text(format!("cogit error: {err}"))]),
    }
}

fn client_name(ctx: &RequestContext<RoleServer>) -> String {
    ctx.peer
        .peer_info()
        .map(|info| info.client_info.name.clone())
        .unwrap_or_default()
}

/// Mirrors the TS `agentName()`: maps known clients to stable labels, falls
/// back to the client's own name (trimmed, 32 chars max), else "human".
fn agent_name(name: &str) -> String {
    let lower = name.to_lowercase();
    if lower.contains("claude") {
        return "claude-code".to_string();
    }
    if lower.contains("cursor") {
        return "cursor".to_string();
    }
    if lower.contains("opencode") {
        return "opencode".to_string();
    }
    let trimmed: String = name.trim().chars().take(32).collect();
    if trimmed.is_empty() {
        "human".to_string()
    } else {
        trimmed
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn agent_name_matches_ts_mapping() {
        assert_eq!(agent_name("Claude Code"), "claude-code");
        assert_eq!(agent_name("claude-desktop"), "claude-code");
        assert_eq!(agent_name("Cursor"), "cursor");
        assert_eq!(agent_name("opencode"), "opencode");
        assert_eq!(agent_name("MyAgent"), "MyAgent");
        assert_eq!(agent_name(""), "human");
        assert_eq!(agent_name("   "), "human");
        assert_eq!(agent_name("  padded  "), "padded");
        let long = "a".repeat(40);
        assert_eq!(agent_name(&long).chars().count(), 32);
    }

    #[test]
    fn tool_surface_matches_ts() {
        let router = CogitMcp::new().tool_router;
        let tools = router.list_all();
        assert_eq!(tools.len(), 3);

        let mut names: Vec<String> = tools.iter().map(|t| t.name.to_string()).collect();
        names.sort();
        assert_eq!(names, ["context_commit", "context_log", "context_pull"]);

        for tool in &tools {
            assert!(
                tool.description.as_deref().is_some_and(|d| !d.is_empty()),
                "{} needs a description",
                tool.name
            );
            assert!(
                tool.title.as_deref().is_some_and(|t| !t.is_empty()),
                "{} needs a title",
                tool.name
            );
        }

        // Shapes below mirror packages/mcp tools/list exactly (see the
        // parity dump in the E2E script): inline enums, no null unions,
        // required lists, and the zod length/range constraints.
        let commit = tools.iter().find(|t| t.name == "context_commit").unwrap();
        let schema = serde_json::Value::Object((*commit.input_schema).clone());
        assert_eq!(schema["type"], "object");
        let required = schema["required"].as_array().unwrap();
        assert_eq!(required.len(), 1);
        assert!(required.iter().any(|v| v == "summary"));
        assert_eq!(schema["properties"]["summary"]["type"], "string");
        assert_eq!(schema["properties"]["summary"]["minLength"], 1);
        assert_eq!(schema["properties"]["summary"]["maxLength"], 200);
        assert!(
            schema["properties"]["summary"]["description"]
                .as_str()
                .is_some_and(|d| d.contains("One-line summary"))
        );
        assert_eq!(schema["properties"]["details"]["type"], "string");
        assert!(schema["properties"]["details"].get("default").is_none());
        assert!(schema["properties"]["details"].get("format").is_none());
        assert_eq!(schema["properties"]["kind"]["type"], "string");
        assert!(schema["properties"]["kind"].get("default").is_none());
        let kind_enum = schema["properties"]["kind"]["enum"].as_array().unwrap();
        assert_eq!(kind_enum.len(), 4);
        for kind in ["scratch", "note", "decision", "milestone"] {
            assert!(kind_enum.iter().any(|v| v == kind));
        }
        assert_eq!(schema["properties"]["tags"]["type"], "array");
        assert_eq!(schema["properties"]["tags"]["items"]["type"], "string");
        assert!(schema.get("$defs").is_none());

        let log = tools.iter().find(|t| t.name == "context_log").unwrap();
        let schema = serde_json::Value::Object((*log.input_schema).clone());
        assert_eq!(schema["properties"]["n"]["type"], "integer");
        assert_eq!(schema["properties"]["n"]["minimum"], 1);
        assert_eq!(schema["properties"]["n"]["maximum"], 100);
        assert!(schema["properties"]["n"].get("default").is_none());
        assert!(schema["properties"]["n"].get("format").is_none());
        assert_eq!(schema["properties"]["branch"]["type"], "string");
        assert!(schema["properties"]["branch"].get("default").is_none());
        assert!(schema.get("required").is_none());

        let pull = tools.iter().find(|t| t.name == "context_pull").unwrap();
        let schema = serde_json::Value::Object((*pull.input_schema).clone());
        let required = schema["required"].as_array().unwrap();
        assert_eq!(required.len(), 1);
        assert!(required.iter().any(|v| v == "branch"));
        assert_eq!(schema["properties"]["branch"]["minLength"], 1);
        assert_eq!(
            schema["properties"]["kind"]["enum"]
                .as_array()
                .unwrap()
                .len(),
            4
        );
        assert_eq!(schema["properties"]["tag"]["type"], "string");

        assert!(commit.output_schema.is_none());
        assert!(log.output_schema.is_none());
        assert!(pull.output_schema.is_none());
    }
}
