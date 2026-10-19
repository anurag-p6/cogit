use alloy::signers::local::PrivateKeySigner;
use alloy::sol_types::SolValue as _;

use cogit_core::arkiv_tx::{self, CreateOpData};
use cogit_core::config::{canonical_json, decode_invite, encode_invite};
use cogit_core::crypto::{decrypt_body, encrypt_body, new_group_key};
use cogit_core::envelope::{BuildEnvelopeInput, build_commit_envelope, parse_commit_envelope};
use cogit_core::types::{CommitBody, CommitKind, VerifyFailureReason};
use cogit_core::verify::{VerifyContext, verify_envelope};

const TEST_KEY: &str = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

fn test_body() -> CommitBody {
    CommitBody {
        summary: "sum".to_string(),
        details: "det".to_string(),
        tags: vec!["t1".to_string()],
    }
}

fn envelope_for(
    signer: &PrivateKeySigner,
    group_key: &[u8; 32],
) -> cogit_core::types::CommitEnvelope {
    build_commit_envelope(&BuildEnvelopeInput {
        repo_id: "deadbeefdeadbeef",
        branch: "main",
        parent: None,
        signer,
        agent: "human",
        kind: CommitKind::Note,
        body: &test_body(),
        group_key,
        ts: Some(1_700_000_000),
    })
    .unwrap()
}

#[test]
fn invite_roundtrip() {
    let key = [7u8; 32];
    let invite = encode_invite("abc123def456", &key);
    assert!(invite.starts_with("cogit1:abc123def456:"));
    let (repo_id, decoded) = decode_invite(&invite).unwrap();
    assert_eq!(repo_id, "abc123def456");
    assert_eq!(decoded, key);
    assert!(decode_invite("nope").is_err());
    assert!(decode_invite("cogit1:abc:AAAA").is_err());
}

#[test]
fn canonical_json_matches_js_json_stringify_ordering() {
    let value = serde_json::json!({"b": 1, "a": [true, null, "x"], "nested": {"z": 2, "a": 1}});
    assert_eq!(
        canonical_json(&value),
        r#"{"a":[true,null,"x"],"b":1,"nested":{"a":1,"z":2}}"#
    );
}

#[test]
fn body_encryption_roundtrip_and_wrong_key() {
    let key = new_group_key().unwrap();
    let body = test_body();
    let (nonce, ciphertext) = encrypt_body(&body, &key).unwrap();
    let back = decrypt_body(&nonce, &ciphertext, &key).unwrap();
    assert_eq!(back.summary, "sum");
    assert_eq!(back.details, "det");
    assert_eq!(back.tags, vec!["t1".to_string()]);

    let other = new_group_key().unwrap();
    assert!(decrypt_body(&nonce, &ciphertext, &other).is_err());
}

#[test]
fn envelope_sign_verify_and_failure_order() {
    let signer: PrivateKeySigner = TEST_KEY.parse().unwrap();
    let owner = signer.address().to_string();
    let group_key = [9u8; 32];
    let env = envelope_for(&signer, &group_key);

    // Roundtrip through the on-chain payload form.
    let json = serde_json::to_string(&env).unwrap();
    let parsed = parse_commit_envelope(&json).unwrap();
    assert_eq!(parsed, env);

    let members = vec![owner.clone()];
    verify_envelope(
        &env,
        &VerifyContext {
            owner: Some(&owner),
            members: Some(&members),
        },
    )
    .unwrap();

    let mut bad_hash = env.clone();
    bad_hash.commit_hash = "0x00".to_string();
    let err = verify_envelope(&bad_hash, &VerifyContext::default()).unwrap_err();
    assert_eq!(err.reason(), VerifyFailureReason::BAD_HASH);

    let mut bad_sig = env.clone();
    bad_sig.sig = format!("0x{}", "11".repeat(65));
    let err = verify_envelope(&bad_sig, &VerifyContext::default()).unwrap_err();
    assert_eq!(err.reason(), VerifyFailureReason::BAD_SIGNATURE);

    let stranger = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    let err = verify_envelope(
        &env,
        &VerifyContext {
            owner: Some(stranger),
            members: None,
        },
    )
    .unwrap_err();
    assert_eq!(err.reason(), VerifyFailureReason::OWNER_MISMATCH);

    let err = verify_envelope(
        &env,
        &VerifyContext {
            owner: Some(&owner),
            members: Some(&[]),
        },
    )
    .unwrap_err();
    assert_eq!(err.reason(), VerifyFailureReason::NOT_MEMBER);
}

#[test]
fn ident32_utf8_left_aligned_padded() {
    let name = arkiv_tx::ident32("$payload");
    assert_eq!(&name.as_slice()[..8], b"$payload");
    assert!(name.as_slice()[8..].iter().all(|b| *b == 0));
    assert!(name.as_slice().iter().all(|b| *b == 0) == false);

    let long = arkiv_tx::ident32(&"x".repeat(40));
    assert_eq!(long.as_slice(), &[b'x'; 32]);
}

#[test]
fn create_op_sorts_attributes_and_encodes_op_type() {
    let attributes = vec![
        arkiv_tx::str_attr("type", "repo"),
        arkiv_tx::payload_cell(b"{}".to_vec()),
        arkiv_tx::str_attr("repo_id", "r1"),
        arkiv_tx::u64_attr("ts", 42),
    ];
    let op = arkiv_tx::create_op(123, 0, 432_000, attributes);
    assert_eq!(op.operation, 1);

    let data = CreateOpData::abi_decode(&op.operationData).unwrap();
    assert_eq!(data.salt, 123);
    assert_eq!(data.minLifetime, 432_000);
    assert_eq!(data.creationFlags, 0);

    let mut names: Vec<[u8; 32]> = data.attributes.iter().map(|a| a.name.0).collect();
    let ascending = {
        let mut sorted = names.clone();
        sorted.sort();
        sorted
    };
    assert_eq!(names, ascending);

    names.dedup();
    assert_eq!(names.len(), 4);

    let payload = data
        .attributes
        .iter()
        .find(|a| a.name == arkiv_tx::ident32("$payload"))
        .unwrap();
    assert_eq!(payload.typeId, 7);
    assert_eq!(payload.value.as_ref(), b"{}");
}
