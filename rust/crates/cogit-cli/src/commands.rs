use std::fs;
use std::path::PathBuf;

use anyhow::{Result, bail};

use cogit_core::arkiv::{create_branch, create_repo, find_branch, find_repo, update_repo_members};
use cogit_core::client::{read_provider, wallet_context};
use cogit_core::config::{decode_invite, encode_invite};
use cogit_core::crypto::{from_base64, new_group_key, to_base64};
use cogit_core::ops::{CommitInput, assert_kind, commit_context, log_context, pull_context};
use cogit_core::render::{render_log_line, short_hex};
use cogit_core::store::{read_config, write_config, write_context_file};
use cogit_core::types::RepoConfig;

fn random_repo_id() -> Result<String> {
    let mut bytes = [0u8; 8];
    getrandom::fill(&mut bytes)?;
    Ok(hex::encode(bytes))
}

pub async fn run_init(name: &str) -> Result<()> {
    let ctx = wallet_context()?;
    let repo_id = random_repo_id()?;
    let group_key = new_group_key()?;
    create_repo(
        &ctx.provider,
        &repo_id,
        name,
        &ctx.address,
        std::slice::from_ref(&ctx.address),
    )
    .await?;
    create_branch(&ctx.provider, &repo_id, "main", &ctx.address, "", None).await?;
    let path = write_config(&RepoConfig {
        repo_id: repo_id.clone(),
        name: name.to_string(),
        branch: "main".to_string(),
        group_key: to_base64(&group_key),
    })?;
    println!(
        "initialized repo \"{name}\" ({repo_id}) owned by {}",
        short_hex(&ctx.address, 10)
    );
    println!("config written to {}", path.display());
    Ok(())
}

pub async fn run_invite(address: &str) -> Result<()> {
    let config = read_config()?;
    let ctx = wallet_context()?;
    let repo = find_repo(&ctx.provider, &config.repo_id).await?;
    let Some(repo) = repo else {
        bail!(
            "repo {} not found on chain — are you on the right network?",
            config.repo_id
        );
    };
    if !repo.members.iter().any(|m| m.eq_ignore_ascii_case(address)) {
        let mut members = repo.members.clone();
        members.push(address.to_string());
        update_repo_members(&ctx.provider, &repo, &members).await?;
        println!("added {address} to repo members");
    } else {
        println!("{address} is already a member");
    }
    println!("invite (send privately — it contains the group key):");
    println!(
        "  {}",
        encode_invite(&config.repo_id, &from_base64(&config.group_key)?)
    );
    Ok(())
}

pub async fn run_join(invite: &str) -> Result<()> {
    let (repo_id, group_key) = decode_invite(invite)?;
    let provider = read_provider()?;
    let repo = find_repo(&provider, &repo_id).await?;
    let Some(repo) = repo else {
        bail!("repo {repo_id} not found on chain — wrong network or invite?");
    };
    let path = write_config(&RepoConfig {
        repo_id: repo_id.clone(),
        name: repo.name.clone(),
        branch: "main".to_string(),
        group_key: to_base64(&group_key),
    })?;
    println!(
        "joined repo \"{}\" ({repo_id}) with {} member(s)",
        repo.name,
        repo.members.len()
    );
    println!("config written to {}", path.display());
    Ok(())
}

pub async fn run_branch(name: &str) -> Result<()> {
    let config = read_config()?;
    let ctx = wallet_context()?;
    if find_branch(&ctx.provider, &config.repo_id, name)
        .await?
        .is_some()
    {
        bail!("branch \"{name}\" already exists");
    }
    let current = find_branch(&ctx.provider, &config.repo_id, &config.branch).await?;
    let fork_point = current
        .as_ref()
        .map(|b| b.head.clone())
        .filter(|head| !head.is_empty());
    create_branch(
        &ctx.provider,
        &config.repo_id,
        name,
        &ctx.address,
        "",
        fork_point.as_deref(),
    )
    .await?;
    let origin = match &fork_point {
        Some(head) => format!("forked from {} @ {}", config.branch, short_hex(head, 10)),
        None => format!("({} has no commits yet)", config.branch),
    };
    println!("created branch \"{name}\" {origin}");
    Ok(())
}

pub async fn run_use(name: &str) -> Result<()> {
    let config = read_config()?;
    let provider = read_provider()?;
    if find_branch(&provider, &config.repo_id, name)
        .await?
        .is_none()
    {
        eprintln!(
            "note: branch \"{name}\" does not exist on chain yet — your first commit will create it"
        );
    }
    write_config(&RepoConfig {
        branch: name.to_string(),
        ..config
    })?;
    println!("now on branch \"{name}\"");
    Ok(())
}

pub struct CommitOptions {
    pub message: String,
    pub details_file: Option<String>,
    pub kind: String,
    pub tags: Vec<String>,
}

pub async fn run_commit(opts: &CommitOptions) -> Result<()> {
    let config = read_config()?;
    let ctx = wallet_context()?;
    let details = match &opts.details_file {
        Some(path) => fs::read_to_string(path)?,
        None => String::new(),
    };
    let kind = assert_kind(&opts.kind)?;
    let result = commit_context(
        &ctx.provider,
        &ctx.signer,
        &ctx.address,
        &config,
        &CommitInput {
            message: opts.message.clone(),
            details,
            kind,
            tags: opts.tags.clone(),
            agent: "human".to_string(),
        },
    )
    .await?;
    println!(
        "committed {} to {} ({})",
        short_hex(&result.commit_hash, 12),
        result.branch,
        result.kind
    );
    Ok(())
}

pub struct PullOptions {
    pub out: Option<String>,
    pub kind: Option<String>,
    pub tag: Option<String>,
}

pub async fn run_pull(branch: &str, opts: &PullOptions) -> Result<()> {
    let config = read_config()?;
    let provider = read_provider()?;
    let kind = opts.kind.as_deref().map(assert_kind).transpose()?;
    let result = pull_context(&provider, &config, branch, kind, opts.tag.as_deref()).await?;
    if !result.members_checked {
        eprintln!(
            "warning: repo {} not found on chain — skipping membership check",
            config.repo_id
        );
    }
    let out_path = match &opts.out {
        Some(out) => {
            let path = PathBuf::from(out);
            fs::write(&path, &result.markdown)?;
            path
        }
        None => write_context_file(branch, &result.markdown)?,
    };
    println!("{}", result.markdown);
    eprintln!(
        "({} verified commit(s) → {})",
        result.verified,
        out_path.display()
    );
    Ok(())
}

pub struct LogOptions {
    pub branch: Option<String>,
}

pub async fn run_log(opts: &LogOptions) -> Result<()> {
    let config = read_config()?;
    let provider = read_provider()?;
    let rows = log_context(&provider, &config, opts.branch.as_deref(), None).await?;
    if rows.is_empty() {
        println!("no commits found");
        return Ok(());
    }
    for row in rows {
        println!("{}", render_log_line(&row));
    }
    Ok(())
}
