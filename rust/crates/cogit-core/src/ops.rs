use anyhow::{Result, bail};

use crate::arkiv::{
    create_branch, create_commit, find_branch, find_repo, list_commits, update_branch_head,
};
use crate::config::expiry_days;
use crate::crypto::{decrypt_body, from_base64};
use crate::envelope::{BuildEnvelopeInput, build_commit_envelope};
use crate::render::{render_commit_section, render_pull_markdown};
use crate::types::{CommitBody, CommitKind, LogRow, LogStatus, RepoConfig};
use crate::verify::{VerifyContext, verify_envelope};

pub const MAX_DETAILS_BYTES: usize = 96 * 1024;

pub fn cap_details(details: &str) -> String {
    if details.len() <= MAX_DETAILS_BYTES {
        return details.to_string();
    }
    let truncated = String::from_utf8_lossy(&details.as_bytes()[..MAX_DETAILS_BYTES]);
    format!("{truncated}\n\n... [truncated by cogit to fit Arkiv's payload limit]")
}

pub fn assert_kind(kind: &str) -> Result<CommitKind> {
    kind.parse::<CommitKind>().map_err(|e| anyhow::anyhow!(e))
}

pub struct CommitInput {
    pub message: String,
    pub details: String,
    pub kind: CommitKind,
    pub tags: Vec<String>,
    pub agent: String,
}

pub struct CommitContextResult {
    pub commit_hash: String,
    pub branch: String,
    pub kind: CommitKind,
    pub parent: Option<String>,
    pub ts: u64,
    pub entity_key: String,
}

pub async fn commit_context(
    provider: &arkiv_sdk::DynProvider,
    signer: &arkiv_sdk::PrivateKeySigner,
    address: &str,
    config: &RepoConfig,
    input: &CommitInput,
) -> Result<CommitContextResult> {
    let existing = find_branch(provider, &config.repo_id, &config.branch).await?;
    let branch = match existing {
        Some(branch) => {
            if !branch.owner.eq_ignore_ascii_case(address) {
                bail!(
                    "branch \"{}\" is owned by {} — Arkiv branch heads can only be advanced by the branch owner's wallet. \
                     Commit to your own branch instead: `cogit branch <your-name>` then `cogit use <your-name>`.",
                    branch.name,
                    branch.owner
                );
            }
            branch
        }
        None => {
            create_branch(provider, &config.repo_id, &config.branch, address, "", None).await?;
            find_branch(provider, &config.repo_id, &config.branch)
                .await?
                .ok_or_else(|| anyhow::anyhow!("could not create branch \"{}\"", config.branch))?
        }
    };

    let body = CommitBody {
        summary: input.message.clone(),
        details: cap_details(&input.details),
        tags: input.tags.clone(),
    };
    let group_key = from_base64(&config.group_key)?;
    let envelope = build_commit_envelope(&BuildEnvelopeInput {
        repo_id: &config.repo_id,
        branch: &branch.name,
        parent: if branch.head.is_empty() {
            None
        } else {
            Some(branch.head.as_str())
        },
        signer,
        agent: &input.agent,
        kind: input.kind,
        body: &body,
        group_key: &group_key,
        ts: None,
    })?;
    let entity_key = create_commit(provider, &envelope).await?;
    update_branch_head(provider, &branch, &envelope.commit_hash).await?;
    Ok(CommitContextResult {
        commit_hash: envelope.commit_hash,
        branch: envelope.branch,
        kind: envelope.kind,
        parent: envelope.parent,
        ts: envelope.ts,
        entity_key,
    })
}

pub struct PullContextResult {
    pub markdown: String,
    pub verified: usize,
    pub invalid: usize,
    pub members_checked: bool,
}

pub async fn pull_context(
    provider: &arkiv_sdk::DynProvider,
    config: &RepoConfig,
    branch: &str,
    kind: Option<CommitKind>,
    tag: Option<&str>,
) -> Result<PullContextResult> {
    let repo = find_repo(provider, &config.repo_id).await?;
    let members = repo.as_ref().map(|r| r.members.clone());
    let group_key = from_base64(&config.group_key)?;
    let records = list_commits(provider, &config.repo_id, Some(branch)).await?;

    let mut sections: Vec<String> = Vec::new();
    let mut invalid = 0usize;
    for record in &records {
        let result = verify_envelope(
            &record.envelope,
            &VerifyContext {
                owner: Some(&record.owner),
                members: members.as_deref(),
            },
        );
        if result.is_err() {
            invalid += 1;
            continue;
        }
        if let Some(kind) = kind {
            if record.envelope.kind != kind {
                continue;
            }
        }
        let body = decrypt_body(
            &record.envelope.nonce,
            &record.envelope.ciphertext,
            &group_key,
        )?;
        if let Some(tag) = tag {
            if !body.tags.iter().any(|t| t == tag) {
                continue;
            }
        }
        sections.push(render_commit_section(&record.envelope, &body));
    }

    Ok(PullContextResult {
        markdown: render_pull_markdown(&config.name, branch, &sections, invalid),
        verified: sections.len(),
        invalid,
        members_checked: repo.is_some(),
    })
}

pub async fn log_context(
    provider: &arkiv_sdk::DynProvider,
    config: &RepoConfig,
    branch: Option<&str>,
    limit: Option<usize>,
) -> Result<Vec<LogRow>> {
    let repo = find_repo(provider, &config.repo_id).await?;
    let members = repo.as_ref().map(|r| r.members.clone());
    let group_key = from_base64(&config.group_key)?;
    let records = list_commits(provider, &config.repo_id, branch).await?;

    let mut rows: Vec<LogRow> = Vec::new();
    for record in &records {
        let env = &record.envelope;
        match verify_envelope(
            env,
            &VerifyContext {
                owner: Some(&record.owner),
                members: members.as_deref(),
            },
        ) {
            Ok(()) => {
                let mut row = LogRow {
                    commit_hash: env.commit_hash.clone(),
                    ts: env.ts,
                    kind: env.kind,
                    branch: env.branch.clone(),
                    author: env.author.clone(),
                    agent: env.agent.clone(),
                    parent: env.parent.clone(),
                    status: LogStatus::Verified,
                    reason: None,
                    detail: None,
                    summary: None,
                    tags: None,
                };
                match decrypt_body(&env.nonce, &env.ciphertext, &group_key) {
                    Ok(body) => {
                        row.summary = Some(body.summary);
                        row.tags = Some(body.tags);
                    }
                    Err(_) => {
                        row.detail = Some(
                            "verified, but body could not be decrypted with the current group key"
                                .to_string(),
                        );
                    }
                }
                rows.push(row);
            }
            Err(err) => {
                rows.push(LogRow {
                    commit_hash: env.commit_hash.clone(),
                    ts: env.ts,
                    kind: env.kind,
                    branch: env.branch.clone(),
                    author: env.author.clone(),
                    agent: env.agent.clone(),
                    parent: env.parent.clone(),
                    status: LogStatus::Invalid,
                    reason: Some(err.reason()),
                    detail: Some(err.detail()),
                    summary: None,
                    tags: None,
                });
            }
        }
    }

    if let Some(limit) = limit {
        let start = rows.len().saturating_sub(limit);
        rows = rows.split_off(start);
    }
    Ok(rows)
}

/// Kept for parity with the TS `expiryForKind` surface (used by docs/tests).
pub fn expiry_days_for(kind: CommitKind) -> u64 {
    expiry_days(kind)
}
