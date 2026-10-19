use alloy::signers::{SignerSync as _, local::PrivateKeySigner};
use anyhow::{Result, anyhow, bail};

use crate::crypto::{CommitHashFields, ciphertext_hash, compute_commit_hash, encrypt_body};
use crate::types::{CommitBody, CommitEnvelope, CommitKind};

pub struct BuildEnvelopeInput<'a> {
    pub repo_id: &'a str,
    pub branch: &'a str,
    pub parent: Option<&'a str>,
    pub signer: &'a PrivateKeySigner,
    pub agent: &'a str,
    pub kind: CommitKind,
    pub body: &'a CommitBody,
    pub group_key: &'a [u8],
    pub ts: Option<u64>,
}

pub fn now_secs() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

pub fn build_commit_envelope(input: &BuildEnvelopeInput<'_>) -> Result<CommitEnvelope> {
    let ts = input.ts.unwrap_or_else(now_secs);
    let author = input.signer.address().to_string();
    let (nonce, ciphertext) = encrypt_body(input.body, input.group_key)?;
    let ct_hash = ciphertext_hash(&ciphertext)?;
    let fields = CommitHashFields {
        repo_id: input.repo_id.to_string(),
        branch: input.branch.to_string(),
        parent: input.parent.map(str::to_string),
        author,
        kind: input.kind,
        ts,
        nonce: nonce.clone(),
        ciphertext_hash: ct_hash.clone(),
    };
    let commit_hash = compute_commit_hash(&fields);
    // EIP-191 personal_sign over the ASCII commit-hash string — matches viem's
    // `signMessage({ message: commitHash })` on the TS side.
    let sig = input
        .signer
        .sign_message_sync(commit_hash.as_bytes())
        .map_err(|e| anyhow!("signing failed: {e}"))?;
    Ok(CommitEnvelope {
        v: 1,
        repo_id: fields.repo_id,
        branch: fields.branch,
        parent: fields.parent,
        author: fields.author,
        kind: fields.kind,
        ts,
        nonce,
        ciphertext_hash: ct_hash,
        agent: input.agent.to_string(),
        ciphertext,
        commit_hash,
        sig: sig.to_string(),
    })
}

pub fn parse_commit_envelope(payload: &str) -> Result<CommitEnvelope> {
    let envelope: CommitEnvelope = serde_json::from_str(payload)
        .map_err(|e| anyhow!("commit payload is not a valid envelope: {e}"))?;
    if envelope.v != 1 {
        bail!("unsupported commit envelope version: {}", envelope.v);
    }
    if envelope.agent.is_empty() || envelope.agent.len() > 32 {
        bail!("commit envelope field agent must be a short non-empty string");
    }
    Ok(envelope)
}
