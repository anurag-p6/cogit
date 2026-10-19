use std::str::FromStr;

use alloy::primitives::Signature;

use crate::crypto::{CommitHashFields, ciphertext_hash, compute_commit_hash};
use crate::types::{CommitEnvelope, VerifyFailureReason};

#[derive(Debug, thiserror::Error)]
pub enum VerifyError {
    #[error("BAD_HASH: {0}")]
    BadHash(String),
    #[error("BAD_SIGNATURE: {0}")]
    BadSignature(String),
    #[error("OWNER_MISMATCH: {0}")]
    OwnerMismatch(String),
    #[error("NOT_MEMBER: {0}")]
    NotMember(String),
}

impl VerifyError {
    pub fn reason(&self) -> VerifyFailureReason {
        match self {
            Self::BadHash(_) => VerifyFailureReason::BAD_HASH,
            Self::BadSignature(_) => VerifyFailureReason::BAD_SIGNATURE,
            Self::OwnerMismatch(_) => VerifyFailureReason::OWNER_MISMATCH,
            Self::NotMember(_) => VerifyFailureReason::NOT_MEMBER,
        }
    }

    pub fn detail(&self) -> String {
        match self {
            Self::BadHash(d)
            | Self::BadSignature(d)
            | Self::OwnerMismatch(d)
            | Self::NotMember(d) => d.clone(),
        }
    }
}

#[derive(Default)]
pub struct VerifyContext<'a> {
    pub owner: Option<&'a str>,
    pub members: Option<&'a [String]>,
}

fn eq_ci(a: &str, b: &str) -> bool {
    a.eq_ignore_ascii_case(b)
}

/// Verification order is part of the protocol contract:
/// BAD_HASH → BAD_SIGNATURE → OWNER_MISMATCH → NOT_MEMBER.
pub fn verify_envelope(
    envelope: &CommitEnvelope,
    ctx: &VerifyContext<'_>,
) -> Result<(), VerifyError> {
    let ct_hash = ciphertext_hash(&envelope.ciphertext)
        .map_err(|e| VerifyError::BadHash(format!("ciphertext not base64: {e}")))?;
    let fields = CommitHashFields {
        repo_id: envelope.repo_id.clone(),
        branch: envelope.branch.clone(),
        parent: envelope.parent.clone(),
        author: envelope.author.clone(),
        kind: envelope.kind,
        ts: envelope.ts,
        nonce: envelope.nonce.clone(),
        ciphertext_hash: ct_hash,
    };
    let recomputed = compute_commit_hash(&fields);
    if !eq_ci(&recomputed, &envelope.commit_hash) {
        return Err(VerifyError::BadHash(format!(
            "recomputed {recomputed} != envelope {}",
            envelope.commit_hash
        )));
    }

    let sig = Signature::from_str(&envelope.sig)
        .map_err(|e| VerifyError::BadSignature(format!("signature unrecoverable: {e}")))?;
    let recovered = sig
        .recover_address_from_msg(envelope.commit_hash.as_bytes())
        .map_err(|e| VerifyError::BadSignature(format!("signature unrecoverable: {e}")))?;
    if !eq_ci(&recovered.to_string(), &envelope.author) {
        return Err(VerifyError::BadSignature(format!(
            "signature recovers {recovered}, envelope says {}",
            envelope.author
        )));
    }

    if let Some(owner) = ctx.owner {
        if !eq_ci(owner, &envelope.author) {
            return Err(VerifyError::OwnerMismatch(format!(
                "entity owner {owner} != author {}",
                envelope.author
            )));
        }
    }

    if let Some(members) = ctx.members {
        if !members.iter().any(|m| eq_ci(m, &envelope.author)) {
            return Err(VerifyError::NotMember(format!(
                "author {} not in members [{}]",
                envelope.author,
                members.join(", ")
            )));
        }
    }

    Ok(())
}
