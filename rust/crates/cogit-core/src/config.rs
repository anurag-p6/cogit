use anyhow::{Context, Result, bail};
use base64::Engine as _;
use serde_json::Value;

use crate::types::CommitKind;

pub const COGIT_DIR: &str = ".cogit";
pub const CONFIG_FILE: &str = "config.json";
pub const CONTEXT_DIR: &str = "context";

/// Arkiv Tiramisu runs on 2-second blocks; expiry is expressed in blocks.
pub const BLOCK_SECONDS: u64 = 2;
pub const BLOCKS_PER_DAY: u64 = 86_400 / BLOCK_SECONDS;
pub const BLOCKS_YEAR: u64 = 365 * BLOCKS_PER_DAY;

pub fn expiry_days(kind: CommitKind) -> u64 {
    match kind {
        CommitKind::Scratch => 3,
        CommitKind::Note => 14,
        CommitKind::Decision => 90,
        CommitKind::Milestone => 365,
    }
}

pub fn expiry_blocks(kind: CommitKind) -> u64 {
    expiry_days(kind) * BLOCKS_PER_DAY
}

pub fn encode_invite(repo_id: &str, group_key: &[u8]) -> String {
    format!(
        "cogit1:{repo_id}:{}",
        base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(group_key)
    )
}

pub fn decode_invite(invite: &str) -> Result<(String, Vec<u8>)> {
    let parts: Vec<&str> = invite.split(':').collect();
    if parts.len() != 3 || parts[0] != "cogit1" {
        bail!("invalid invite string: {invite}");
    }
    let encoded = parts[2];
    let group_key = base64::engine::general_purpose::URL_SAFE_NO_PAD
        .decode(encoded)
        .or_else(|_| base64::engine::general_purpose::URL_SAFE.decode(encoded))
        .with_context(|| format!("invalid invite group key encoding: {invite}"))?;
    if group_key.len() != 32 {
        bail!("invite group key must be 32 bytes, got {}", group_key.len());
    }
    Ok((parts[1].to_string(), group_key))
}

/// Canonical JSON: recursively sort object keys, then serialize.
///
/// Must reproduce JS `JSON.stringify` byte-for-byte for the commit-hash
/// preimage (fixed ASCII keys, integer values) — cross-stack interop tests
/// pin this behavior.
pub fn canonical_json(value: &Value) -> String {
    match value {
        Value::Object(map) => {
            let mut keys: Vec<&String> = map.keys().collect();
            keys.sort();
            let mut out = String::from("{");
            for (i, key) in keys.iter().enumerate() {
                if i > 0 {
                    out.push(',');
                }
                out.push_str(&serde_json::to_string(key).expect("string serialization"));
                out.push(':');
                out.push_str(&canonical_json(&map[*key]));
            }
            out.push('}');
            out
        }
        Value::Array(items) => {
            let mut out = String::from("[");
            for (i, item) in items.iter().enumerate() {
                if i > 0 {
                    out.push(',');
                }
                out.push_str(&canonical_json(item));
            }
            out.push(']');
            out
        }
        other => other.to_string(),
    }
}
