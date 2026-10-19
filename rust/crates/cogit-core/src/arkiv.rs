use alloy::primitives::{Address, B256};
use anyhow::{Result, anyhow, bail};
use arkiv_sdk::{DynProvider, Provider as _};
use serde_json::Value;

use crate::arkiv_tx;
use crate::config::{BLOCKS_YEAR, expiry_blocks};
use crate::envelope::parse_commit_envelope;
use crate::render::value_to_string;
use crate::types::CommitEnvelope;

pub struct RepoRecord {
    pub key: String,
    pub owner: String,
    pub name: String,
    pub members: Vec<String>,
}

pub struct BranchRecord {
    pub key: String,
    pub name: String,
    pub owner: String,
    pub head: String,
    pub forked_from: Option<String>,
}

pub struct CommitRecord {
    pub key: String,
    pub owner: String,
    pub envelope: CommitEnvelope,
}

fn esc(value: &str) -> String {
    // Query-language string escaping is SQL-style `''` — no backslash escapes.
    value.replace('\'', "''")
}

fn filter_repo(repo_id: &str) -> String {
    format!("type = str('repo') AND repo_id = str('{}')", esc(repo_id))
}

fn filter_branch(repo_id: &str, name: &str) -> String {
    format!(
        "type = str('branch') AND repo_id = str('{}') AND name = str('{}')",
        esc(repo_id),
        esc(name)
    )
}

fn filter_commits(repo_id: &str, branch: Option<&str>) -> String {
    match branch {
        Some(branch) => format!(
            "type = str('commit') AND repo_id = str('{}') AND branch = str('{}')",
            esc(repo_id),
            esc(branch)
        ),
        None => format!("type = str('commit') AND repo_id = str('{}')", esc(repo_id)),
    }
}

// The live Tiramisu RPC takes camelCase `{select, limit, cursor, atBlock}`
// options — NOT the SDK's `QueryOpts` (which serializes `at_block` /
// `results_per_page` snake_case and is rejected with -32602).
// `select` is a flat per-field projection; `limit` is a hex quantity (max 200).
// FRICTION: see docs/FRICTION_LOG_RUST.md (F-RS-05).
fn full_select() -> Value {
    serde_json::json!({
        "key": true,
        "owner": true,
        "creator": true,
        "createdAt": true,
        "updatedAt": true,
        "expiresAt": true,
        "contentType": true,
        "payload": true,
        "attributes": true,
    })
}

async fn query(provider: &DynProvider, filter: &str, limit: Option<usize>) -> Result<Vec<Value>> {
    let mut out: Vec<Value> = Vec::new();
    let mut cursor: Option<String> = None;
    let page = limit.unwrap_or(200).min(200) as u64;
    loop {
        let mut options = serde_json::Map::new();
        options.insert("select".into(), full_select());
        options.insert("limit".into(), Value::String(format!("0x{page:x}")));
        if let Some(cursor) = &cursor {
            options.insert("cursor".into(), Value::String(cursor.clone()));
        }
        let response: Value = provider
            .client()
            .request("arkiv_query", (filter, Value::Object(options)))
            .await
            .map_err(|e| anyhow!("arkiv query failed: {e}"))?;
        let mut data = response
            .get("data")
            .or_else(|| response.get("entities"))
            .and_then(Value::as_array)
            .cloned()
            .unwrap_or_default();
        let got = data.len();
        out.append(&mut data);
        if let Some(max) = limit {
            if out.len() >= max {
                out.truncate(max);
                break;
            }
        }
        cursor = response
            .get("cursor")
            .and_then(Value::as_str)
            .map(str::to_string)
            .filter(|c| !c.is_empty());
        if cursor.is_none() || got == 0 {
            break;
        }
    }
    Ok(out)
}

fn str_field(entity: &Value, name: &str) -> Option<String> {
    entity.get(name).and_then(Value::as_str).map(str::to_string)
}

fn attr_value(entity: &Value, name: &str) -> Option<String> {
    let attrs = entity.get("attributes")?;
    // Raw RPC form: array of { name, type, value }.
    if let Some(arr) = attrs.as_array() {
        for item in arr {
            if item.get("name").and_then(Value::as_str) == Some(name) {
                return item.get("value").and_then(value_to_string);
            }
        }
        return None;
    }
    // Decoded form fallback: object map, values possibly `{ value: ... }`.
    attrs.as_object()?.get(name).and_then(value_to_string)
}

fn payload_bytes(entity: &Value) -> Result<Vec<u8>> {
    match str_field(entity, "payload") {
        Some(hex_str) => {
            let trimmed = hex_str.trim_start_matches("0x");
            Ok(hex::decode(trimmed)?)
        }
        None => Ok(Vec::new()),
    }
}

fn payload_text(entity: &Value) -> Result<String> {
    Ok(String::from_utf8_lossy(&payload_bytes(entity)?).to_string())
}

fn to_commit_record(entity: &Value) -> Result<CommitRecord> {
    let envelope = parse_commit_envelope(&payload_text(entity)?)?;
    Ok(CommitRecord {
        key: str_field(entity, "key").unwrap_or_default(),
        owner: str_field(entity, "owner").unwrap_or_default(),
        envelope,
    })
}

fn parse_address(text: &str) -> Result<Address> {
    text.parse::<Address>()
        .map_err(|e| anyhow!("invalid address {text:?}: {e}"))
}

pub async fn create_repo(
    provider: &DynProvider,
    repo_id: &str,
    name: &str,
    owner: &str,
    members: &[String],
) -> Result<String> {
    let payload = serde_json::json!({ "name": name, "members": members }).to_string();
    let attributes = vec![
        arkiv_tx::str_attr("type", "repo"),
        arkiv_tx::str_attr("repo_id", repo_id),
        arkiv_tx::addr_attr("owner", parse_address(owner)?),
        arkiv_tx::payload_cell(payload.into_bytes()),
        arkiv_tx::content_type_cell("application/json"),
    ];
    let op = arkiv_tx::create_op(arkiv_tx::random_salt()?, 0, BLOCKS_YEAR, attributes);
    let key = arkiv_tx::send_create(provider, op).await?;
    Ok(format!("{key:#x}"))
}

pub async fn create_branch(
    provider: &DynProvider,
    repo_id: &str,
    name: &str,
    owner: &str,
    head: &str,
    forked_from: Option<&str>,
) -> Result<String> {
    let mut attributes = vec![
        arkiv_tx::str_attr("type", "branch"),
        arkiv_tx::str_attr("repo_id", repo_id),
        arkiv_tx::str_attr("name", name),
        arkiv_tx::addr_attr("owner", parse_address(owner)?),
    ];
    if !head.is_empty() {
        attributes.push(arkiv_tx::str_attr("head", head));
    }
    if let Some(forked_from) = forked_from {
        attributes.push(arkiv_tx::str_attr("forked_from", forked_from));
    }
    attributes.push(arkiv_tx::payload_cell(Vec::new()));
    attributes.push(arkiv_tx::content_type_cell("application/octet-stream"));
    let op = arkiv_tx::create_op(arkiv_tx::random_salt()?, 0, BLOCKS_YEAR, attributes);
    let key = arkiv_tx::send_create(provider, op).await?;
    Ok(format!("{key:#x}"))
}

pub async fn create_commit(provider: &DynProvider, envelope: &CommitEnvelope) -> Result<String> {
    let payload = serde_json::to_vec(envelope)?;
    let mut attributes = vec![
        arkiv_tx::str_attr("type", "commit"),
        arkiv_tx::str_attr("repo_id", &envelope.repo_id),
        arkiv_tx::str_attr("branch", &envelope.branch),
        arkiv_tx::str_attr("kind", envelope.kind.as_str()),
        arkiv_tx::addr_attr("author", parse_address(&envelope.author)?),
        arkiv_tx::str_attr("commit_hash", &envelope.commit_hash),
    ];
    if let Some(parent) = &envelope.parent {
        attributes.push(arkiv_tx::str_attr("parent", parent));
    }
    attributes.push(arkiv_tx::u64_attr("ts", envelope.ts));
    attributes.push(arkiv_tx::payload_cell(payload));
    attributes.push(arkiv_tx::content_type_cell("application/json"));
    let op = arkiv_tx::create_op(
        arkiv_tx::random_salt()?,
        0,
        expiry_blocks(envelope.kind),
        attributes,
    );
    let key = arkiv_tx::send_create(provider, op).await?;
    Ok(format!("{key:#x}"))
}

pub async fn update_branch_head(
    provider: &DynProvider,
    branch: &BranchRecord,
    head: &str,
) -> Result<()> {
    let key = parse_entity_key(&branch.key)?;
    let patch = arkiv_tx::patch_op(key, vec![arkiv_tx::str_attr("head", head)]);
    let extend = arkiv_tx::extend_op(key, 0, BLOCKS_YEAR);
    // One atomic batch — the TS SDK sends patch + extend as two transactions;
    // the on-chain result is identical.
    arkiv_tx::send_ops(provider, vec![patch, extend]).await?;
    Ok(())
}

pub async fn update_repo_members(
    provider: &DynProvider,
    repo: &RepoRecord,
    members: &[String],
) -> Result<()> {
    let key = parse_entity_key(&repo.key)?;
    let payload = serde_json::json!({ "name": repo.name, "members": members }).to_string();
    let patch = arkiv_tx::patch_op(key, vec![arkiv_tx::payload_cell(payload.into_bytes())]);
    arkiv_tx::send_ops(provider, vec![patch]).await?;
    Ok(())
}

fn parse_entity_key(text: &str) -> Result<B256> {
    let bytes = hex::decode(text.trim_start_matches("0x"))
        .map_err(|e| anyhow!("invalid entity key {text:?}: {e}"))?;
    if bytes.len() != 32 {
        bail!("invalid entity key length {} for {text:?}", bytes.len());
    }
    Ok(B256::from_slice(&bytes))
}

pub async fn find_repo(provider: &DynProvider, repo_id: &str) -> Result<Option<RepoRecord>> {
    let rows = query(provider, &filter_repo(repo_id), Some(1)).await?;
    let Some(entity) = rows.first() else {
        return Ok(None);
    };
    let payload: Value = serde_json::from_str(&payload_text(entity)?).unwrap_or(Value::Null);
    Ok(Some(RepoRecord {
        key: str_field(entity, "key").unwrap_or_default(),
        owner: str_field(entity, "owner").unwrap_or_default(),
        name: payload
            .get("name")
            .and_then(Value::as_str)
            .unwrap_or("")
            .to_string(),
        members: payload
            .get("members")
            .and_then(Value::as_array)
            .map(|items| {
                items
                    .iter()
                    .filter_map(|m| m.as_str().map(str::to_string))
                    .collect()
            })
            .unwrap_or_default(),
    }))
}

pub async fn find_branch(
    provider: &DynProvider,
    repo_id: &str,
    name: &str,
) -> Result<Option<BranchRecord>> {
    let rows = query(provider, &filter_branch(repo_id, name), Some(1)).await?;
    let Some(entity) = rows.first() else {
        return Ok(None);
    };
    let head = attr_value(entity, "head").unwrap_or_default();
    let forked_from = attr_value(entity, "forked_from");
    Ok(Some(BranchRecord {
        key: str_field(entity, "key").unwrap_or_default(),
        name: attr_value(entity, "name").unwrap_or_default(),
        owner: attr_value(entity, "owner").unwrap_or_default(),
        head,
        forked_from,
    }))
}

pub async fn list_commits(
    provider: &DynProvider,
    repo_id: &str,
    branch: Option<&str>,
) -> Result<Vec<CommitRecord>> {
    let rows = query(provider, &filter_commits(repo_id, branch), None).await?;
    let mut records: Vec<CommitRecord> =
        rows.iter().map(to_commit_record).collect::<Result<_>>()?;
    records.sort_by_key(|r| r.envelope.ts);
    Ok(records)
}

pub async fn find_commit_by_hash(
    provider: &DynProvider,
    repo_id: &str,
    commit_hash: &str,
) -> Result<Option<CommitRecord>> {
    let filter = format!(
        "type = str('commit') AND repo_id = str('{}') AND commit_hash = str('{}')",
        esc(repo_id),
        esc(commit_hash)
    );
    let rows = query(provider, &filter, Some(1)).await?;
    rows.first().map(to_commit_record).transpose()
}
