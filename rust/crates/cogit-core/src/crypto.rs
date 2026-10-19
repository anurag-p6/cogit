use anyhow::{Result, anyhow};
use base64::Engine as _;
use chacha20poly1305::{
    XChaCha20Poly1305, XNonce,
    aead::{Aead, KeyInit},
};
use serde_json::Value;
use sha2::{Digest, Sha256};

use crate::config::canonical_json;
use crate::types::{CommitBody, CommitKind};

pub fn to_base64(bytes: &[u8]) -> String {
    base64::engine::general_purpose::STANDARD.encode(bytes)
}

pub fn from_base64(text: &str) -> Result<Vec<u8>> {
    Ok(base64::engine::general_purpose::STANDARD.decode(text)?)
}

pub fn new_group_key() -> Result<[u8; 32]> {
    let mut key = [0u8; 32];
    getrandom::fill(&mut key)?;
    Ok(key)
}

pub fn sha256_hex(data: &[u8]) -> String {
    hex::encode(Sha256::digest(data))
}

pub fn encrypt_body(body: &CommitBody, group_key: &[u8]) -> Result<(String, String)> {
    let mut nonce = [0u8; 24];
    getrandom::fill(&mut nonce)?;
    let cipher = XChaCha20Poly1305::new_from_slice(group_key)
        .map_err(|e| anyhow!("invalid group key length: {e}"))?;
    let plaintext = serde_json::to_vec(body)?;
    let sealed = cipher
        .encrypt(XNonce::from_slice(&nonce), plaintext.as_slice())
        .map_err(|e| anyhow!("encryption failed: {e}"))?;
    Ok((to_base64(&nonce), to_base64(&sealed)))
}

pub fn decrypt_body(
    nonce_base64: &str,
    ciphertext_base64: &str,
    group_key: &[u8],
) -> Result<CommitBody> {
    let nonce = from_base64(nonce_base64)?;
    let ciphertext = from_base64(ciphertext_base64)?;
    let cipher = XChaCha20Poly1305::new_from_slice(group_key)
        .map_err(|e| anyhow!("invalid group key length: {e}"))?;
    let opened = cipher
        .decrypt(XNonce::from_slice(&nonce), ciphertext.as_slice())
        .map_err(|_| anyhow!("decryption failed — wrong group key or corrupted ciphertext"))?;
    Ok(serde_json::from_slice(&opened)?)
}

/// hash of the raw (decoded) ciphertext bytes, hex, no 0x prefix.
pub fn ciphertext_hash(ciphertext_base64: &str) -> Result<String> {
    Ok(sha256_hex(&from_base64(ciphertext_base64)?))
}

#[derive(Debug, Clone)]
pub struct CommitHashFields {
    pub repo_id: String,
    pub branch: String,
    pub parent: Option<String>,
    pub author: String,
    pub kind: CommitKind,
    pub ts: u64,
    pub nonce: String,
    pub ciphertext_hash: String,
}

/// `0x` + sha256(canonicalJson(fields)) — byte-compatible with the TS SDK side.
pub fn compute_commit_hash(fields: &CommitHashFields) -> String {
    let mut map = serde_json::Map::new();
    map.insert("v".into(), Value::from(1u8));
    map.insert("repoId".into(), Value::String(fields.repo_id.clone()));
    map.insert("branch".into(), Value::String(fields.branch.clone()));
    map.insert(
        "parent".into(),
        match &fields.parent {
            Some(parent) => Value::String(parent.clone()),
            None => Value::Null,
        },
    );
    map.insert("author".into(), Value::String(fields.author.clone()));
    map.insert(
        "kind".into(),
        Value::String(fields.kind.as_str().to_string()),
    );
    map.insert("ts".into(), Value::from(fields.ts));
    map.insert("nonce".into(), Value::String(fields.nonce.clone()));
    map.insert(
        "ciphertextHash".into(),
        Value::String(fields.ciphertext_hash.clone()),
    );
    format!(
        "0x{}",
        sha256_hex(canonical_json(&Value::Object(map)).as_bytes())
    )
}
