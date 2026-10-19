//! Raw `execute` encoder for the live Tiramisu engine.
//!
//! The engine's one write entry point is
//! `execute((uint8 operation, bytes operationData)[])` on `0x4400…0044`, where
//! `operationData` is `abi.encode` of a tagged-union struct and entity
//! attributes travel as `(Ident32 name, uint8 typeId, bytes value)` triples
//! (strictly ascending by name), with the payload and content type as the
//! `$payload`/`$contentType` system cells.
//!
//! The pinned `arkiv-sdk` 0.5.0 write path sends brotli-compressed RLP as raw
//! calldata instead — the live engine silently ignores it (the transaction
//! succeeds and emits zero events). This module reproduces the engine ABI
//! exactly, byte-for-byte with `@arkiv-network/sdk` 0.8.1.
//!
//! FRICTION: see docs/FRICTION_LOG_RUST.md (F-RS-01).

use alloy::network::TransactionBuilder as _;
use alloy::primitives::{Address, B256, Bytes, address};
use alloy::providers::Provider as _;
use alloy::rpc::types::TransactionRequest;
use alloy::sol;
use alloy::sol_types::{SolCall as _, SolEvent as _, SolValue as _};
use anyhow::{Result, anyhow};

use arkiv_sdk::DynProvider;

pub const ARKIV_ADDRESS: Address = address!("0x4400000000000000000000000000000000000044");

sol! {
    /// One attribute cell: `Ident32` name (UTF-8, left-aligned, null-padded), type id, value bytes.
    #[derive(Debug)]
    struct AbiAttribute {
        bytes32 name;
        uint8 typeId;
        bytes value;
    }

    #[derive(Debug)]
    struct CreateOpData {
        uint128 salt;
        uint64 expiresAt;
        uint64 minLifetime;
        uint8 creationFlags;
        AbiAttribute[] attributes;
    }

    #[derive(Debug)]
    struct PatchOpData {
        bytes32 entityKey;
        AbiAttribute[] mutations;
    }

    #[derive(Debug)]
    struct ExtendOpData {
        bytes32 entityKey;
        uint64 expiresAt;
        uint64 minLifetime;
    }

    #[derive(Debug)]
    struct ChownOpData {
        bytes32 entityKey;
        address newOwner;
    }

    #[derive(Debug)]
    struct DeleteOpData {
        bytes32 entityKey;
    }

    #[derive(Debug)]
    struct OperationStruct {
        uint8 operation;
        bytes operationData;
    }

    function execute(OperationStruct[] ops) external returns (bytes32[] keys);

    event EntityCreated(bytes32 indexed entityKey, address indexed owner, uint64 expiresAt, uint8 creationFlags);
    event EntityPatched(bytes32 indexed entityKey, address indexed owner);
    event ExpiryExtended(bytes32 indexed entityKey, address indexed owner, uint64 expiresAt);
    event OwnershipTransferred(bytes32 indexed entityKey, address indexed previousOwner, address indexed newOwner);
    event EntityDeleted(bytes32 indexed entityKey, address indexed owner);
}

const OP_CREATE: u8 = 1;
const OP_PATCH: u8 = 2;
const OP_EXTEND: u8 = 3;
#[allow(dead_code)]
const OP_CHOWN: u8 = 4;
#[allow(dead_code)]
const OP_DELETE: u8 = 5;

const TYPE_U64: u8 = 3;
const TYPE_BYTES: u8 = 7;
const TYPE_STR: u8 = 8;
const TYPE_ADDR: u8 = 9;

/// UTF-8, left-aligned, null-padded to 32 bytes — the engine's `Ident32`.
pub fn ident32(name: &str) -> B256 {
    let mut bytes = [0u8; 32];
    let src = name.as_bytes();
    let n = src.len().min(32);
    bytes[..n].copy_from_slice(&src[..n]);
    B256::from(bytes)
}

fn u64_word(value: u64) -> Bytes {
    let mut word = [0u8; 32];
    word[24..].copy_from_slice(&value.to_be_bytes());
    Bytes::from(word.to_vec())
}

fn addr_word(addr: Address) -> Bytes {
    let mut word = [0u8; 32];
    word[12..].copy_from_slice(addr.as_slice());
    Bytes::from(word.to_vec())
}

pub fn str_attr(name: &str, value: &str) -> AbiAttribute {
    AbiAttribute {
        name: ident32(name),
        typeId: TYPE_STR,
        value: Bytes::from(value.as_bytes().to_vec()),
    }
}

pub fn u64_attr(name: &str, value: u64) -> AbiAttribute {
    AbiAttribute {
        name: ident32(name),
        typeId: TYPE_U64,
        value: u64_word(value),
    }
}

pub fn addr_attr(name: &str, value: Address) -> AbiAttribute {
    AbiAttribute {
        name: ident32(name),
        typeId: TYPE_ADDR,
        value: addr_word(value),
    }
}

/// The `$payload` system cell — the one `bytes`-typed attribute.
pub fn payload_cell(payload: Vec<u8>) -> AbiAttribute {
    AbiAttribute {
        name: ident32("$payload"),
        typeId: TYPE_BYTES,
        value: Bytes::from(payload),
    }
}

/// The `$contentType` system cell.
pub fn content_type_cell(content_type: &str) -> AbiAttribute {
    AbiAttribute {
        name: ident32("$contentType"),
        typeId: TYPE_STR,
        value: Bytes::from(content_type.as_bytes().to_vec()),
    }
}

/// 128-bit random salt, big-endian — the engine derives the entity key from it.
pub fn random_salt() -> Result<u128> {
    let mut salt = [0u8; 16];
    getrandom::fill(&mut salt)?;
    Ok(u128::from_be_bytes(salt))
}

/// The engine requires attributes strictly ascending by their `bytes32` name.
fn sorted(mut attributes: Vec<AbiAttribute>) -> Vec<AbiAttribute> {
    attributes.sort_by(|a, b| a.name.cmp(&b.name));
    attributes
}

pub fn create_op(
    salt: u128,
    expires_at: u64,
    min_lifetime: u64,
    attributes: Vec<AbiAttribute>,
) -> OperationStruct {
    let data = CreateOpData {
        salt,
        expiresAt: expires_at,
        minLifetime: min_lifetime,
        creationFlags: 0,
        attributes: sorted(attributes),
    };
    OperationStruct {
        operation: OP_CREATE,
        operationData: data.abi_encode().into(),
    }
}

pub fn patch_op(entity_key: B256, mutations: Vec<AbiAttribute>) -> OperationStruct {
    let data = PatchOpData {
        entityKey: entity_key,
        mutations: sorted(mutations),
    };
    OperationStruct {
        operation: OP_PATCH,
        operationData: data.abi_encode().into(),
    }
}

pub fn extend_op(entity_key: B256, expires_at: u64, min_lifetime: u64) -> OperationStruct {
    let data = ExtendOpData {
        entityKey: entity_key,
        expiresAt: expires_at,
        minLifetime: min_lifetime,
    };
    OperationStruct {
        operation: OP_EXTEND,
        operationData: data.abi_encode().into(),
    }
}

#[derive(Debug, Default)]
pub struct AppliedOps {
    /// `(entityKey, expiresAt)` per create, in batch order.
    pub created: Vec<(B256, u64)>,
    /// `(entityKey, newExpiresAt)` per extension, in batch order.
    pub extended: Vec<(B256, u64)>,
}

/// Sends one atomic `execute` batch and decodes the engine events it emitted.
pub async fn send_ops(provider: &DynProvider, ops: Vec<OperationStruct>) -> Result<AppliedOps> {
    if ops.is_empty() {
        return Err(anyhow!("no operations to send"));
    }
    let call = executeCall { ops };
    let tx = TransactionRequest::default()
        .with_to(ARKIV_ADDRESS)
        .with_input(call.abi_encode());
    let pending = provider
        .send_transaction(tx)
        .await
        .map_err(|e| anyhow!("execute() send failed: {e}"))?;
    let receipt = pending
        .get_receipt()
        .await
        .map_err(|e| anyhow!("execute() receipt failed: {e}"))?;

    let mut applied = AppliedOps::default();
    for log in receipt.logs() {
        if log.address() != ARKIV_ADDRESS {
            continue;
        }
        if let Ok(event) = EntityCreated::decode_log(&log.inner) {
            applied.created.push((event.entityKey, event.expiresAt));
        } else if let Ok(event) = ExpiryExtended::decode_log(&log.inner) {
            applied.extended.push((event.entityKey, event.expiresAt));
        }
    }
    Ok(applied)
}

/// Convenience for single-create flows: returns the minted entity key.
pub async fn send_create(provider: &DynProvider, op: OperationStruct) -> Result<B256> {
    let applied = send_ops(provider, vec![op]).await?;
    applied
        .created
        .first()
        .map(|(key, _)| *key)
        .ok_or_else(|| anyhow!("execute() succeeded but emitted no EntityCreated event"))
}
