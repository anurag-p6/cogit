//! Live probe against Arkiv Tiramisu — validates query response shapes,
//! envelope verification and decryption.
//!
//! Read-only mode works from any directory that has PROBE_REPO_ID set (or a
//! `.cogit/config.json`):
//!   PROBE_REPO_ID=<id> cargo run -p cogit-core --example probe
//! With PROBE_WRITE=1 it performs a full write path (create repo if missing,
//! create branch + commit + advance head) on the `rust-probe` branch and
//! pulls it back. Write mode needs a `.cogit/config.json` + PRIVATE_KEY.

use std::env;

use anyhow::{Context, Result, bail};
use arkiv_sdk::Provider as _;
use cogit_core::{
    arkiv, client,
    ops::{CommitInput, commit_context, pull_context},
    store,
    types::CommitKind,
    verify::{VerifyContext, verify_envelope},
};

#[tokio::main]
async fn main() -> Result<()> {
    dotenvy::dotenv().ok();
    let config = store::read_config().ok();
    let repo_id = env::var("PROBE_REPO_ID")
        .ok()
        .or_else(|| config.as_ref().map(|c| c.repo_id.clone()))
        .context("set PROBE_REPO_ID or run in a project with .cogit/config.json")?;
    let branch_name = config
        .as_ref()
        .map(|c| c.branch.clone())
        .unwrap_or_else(|| "main".to_string());
    let group_key = config
        .as_ref()
        .map(|c| cogit_core::from_base64(&c.group_key))
        .transpose()?;
    let repo_name = config
        .as_ref()
        .map(|c| c.name.clone())
        .unwrap_or_else(|| repo_id.clone());
    println!(
        "probe: repo_id={repo_id} branch={branch_name} decrypt={}",
        group_key.is_some()
    );

    let provider = client::read_provider()?;

    println!("\n=== raw query: repo entity shape ===");
    let raw: serde_json::Value = provider
        .client()
        .request(
            "arkiv_query",
            (
                format!("type = str('repo') AND repo_id = str('{repo_id}')"),
                serde_json::json!({
                    "select": {
                        "key": true, "owner": true, "creator": true, "createdAt": true,
                        "updatedAt": true, "expiresAt": true, "contentType": true,
                        "payload": true, "attributes": true,
                    },
                    "limit": "0x1",
                }),
            ),
        )
        .await?;
    if let Some(obj) = raw.as_object() {
        println!("response keys: {:?}", obj.keys().collect::<Vec<_>>());
    }
    println!("{}", serde_json::to_string_pretty(&raw)?);

    println!("\n=== find_repo / find_branch / list_commits ===");
    let repo = arkiv::find_repo(&provider, &repo_id).await?;
    match &repo {
        Some(repo) => println!(
            "repo: key={} owner={} name={:?} members={:?}",
            repo.key, repo.owner, repo.name, repo.members
        ),
        None => println!("repo NOT FOUND"),
    }
    let branch = arkiv::find_branch(&provider, &repo_id, &branch_name).await?;
    match &branch {
        Some(branch) => println!(
            "branch: key={} name={} owner={} head={} forked_from={:?}",
            branch.key, branch.name, branch.owner, branch.head, branch.forked_from
        ),
        None => println!("branch NOT FOUND"),
    }

    let commits = arkiv::list_commits(&provider, &repo_id, Some(&branch_name)).await?;
    let members = repo.as_ref().map(|r| r.members.clone());
    let mut ok = 0usize;
    let mut bad = 0usize;
    for record in &commits {
        let verdict = verify_envelope(
            &record.envelope,
            &VerifyContext {
                owner: Some(&record.owner),
                members: members.as_deref(),
            },
        );
        match verdict {
            Ok(()) => {
                ok += 1;
                let body = match &group_key {
                    Some(group_key) => match cogit_core::decrypt_body(
                        &record.envelope.nonce,
                        &record.envelope.ciphertext,
                        group_key,
                    ) {
                        Ok(body) => format!(" — {}", body.summary),
                        Err(_) => " — (undecryptable with this key)".to_string(),
                    },
                    None => String::new(),
                };
                println!(
                    "  verified {} [{}] {}{}",
                    cogit_core::short_hex(&record.envelope.commit_hash, 12),
                    record.envelope.kind,
                    record.envelope.agent,
                    body
                );
            }
            Err(err) => {
                bad += 1;
                println!(
                    "  INVALID {}: {:?} {}",
                    record.envelope.commit_hash,
                    err.reason(),
                    err.detail()
                );
            }
        }
    }
    println!("commits: {} verified, {} invalid", ok, bad);

    if env::var("PROBE_WRITE").as_deref() == Ok("1") {
        println!("\n=== write path on branch rust-probe ===");
        let Some(config) = &config else {
            bail!("PROBE_WRITE=1 needs a .cogit/config.json in the current directory");
        };
        let ctx = client::wallet_context()?;
        println!("wallet: {}", ctx.address);
        if arkiv::find_repo(&ctx.provider, &config.repo_id)
            .await?
            .is_none()
        {
            let repo_key = arkiv::create_repo(
                &ctx.provider,
                &config.repo_id,
                &repo_name,
                &ctx.address,
                std::slice::from_ref(&ctx.address),
            )
            .await?;
            println!("created repo entity {repo_key}");
        }
        let result = commit_context(
            &ctx.provider,
            &ctx.signer,
            &ctx.address,
            config,
            &CommitInput {
                message: format!("rust probe at {}", cogit_core::envelope::now_secs()),
                details: "automated probe from the Rust port — safe to delete".to_string(),
                kind: CommitKind::Scratch,
                tags: vec!["rust-probe".to_string()],
                agent: "rust-probe".to_string(),
            },
        )
        .await?;
        println!(
            "committed {} (entity {}) on branch {}",
            result.commit_hash, result.entity_key, result.branch
        );
        let pull = pull_context(&ctx.provider, config, "rust-probe", None, None).await?;
        println!("\n{}", pull.markdown);
    }

    Ok(())
}
