use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum CommitKind {
    Scratch,
    Note,
    Decision,
    Milestone,
}

pub const COMMIT_KINDS: [CommitKind; 4] = [
    CommitKind::Scratch,
    CommitKind::Note,
    CommitKind::Decision,
    CommitKind::Milestone,
];

impl CommitKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Scratch => "scratch",
            Self::Note => "note",
            Self::Decision => "decision",
            Self::Milestone => "milestone",
        }
    }
}

impl std::fmt::Display for CommitKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(self.as_str())
    }
}

impl std::str::FromStr for CommitKind {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "scratch" => Ok(Self::Scratch),
            "note" => Ok(Self::Note),
            "decision" => Ok(Self::Decision),
            "milestone" => Ok(Self::Milestone),
            other => Err(format!(
                "invalid kind \"{other}\" — one of: scratch, note, decision, milestone"
            )),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[allow(non_camel_case_types)]
pub enum VerifyFailureReason {
    BAD_HASH,
    BAD_SIGNATURE,
    OWNER_MISMATCH,
    NOT_MEMBER,
}

impl VerifyFailureReason {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::BAD_HASH => "BAD_HASH",
            Self::BAD_SIGNATURE => "BAD_SIGNATURE",
            Self::OWNER_MISMATCH => "OWNER_MISMATCH",
            Self::NOT_MEMBER => "NOT_MEMBER",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum LogStatus {
    Verified,
    Invalid,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LogRow {
    pub commit_hash: String,
    pub ts: u64,
    pub kind: CommitKind,
    pub branch: String,
    pub author: String,
    pub agent: String,
    pub parent: Option<String>,
    pub status: LogStatus,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reason: Option<VerifyFailureReason>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub detail: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommitBody {
    pub summary: String,
    pub details: String,
    pub tags: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommitEnvelope {
    pub v: u8,
    pub repo_id: String,
    pub branch: String,
    pub parent: Option<String>,
    pub author: String,
    pub kind: CommitKind,
    pub ts: u64,
    pub nonce: String,
    pub ciphertext_hash: String,
    pub agent: String,
    pub ciphertext: String,
    pub commit_hash: String,
    pub sig: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RepoConfig {
    pub repo_id: String,
    pub name: String,
    pub branch: String,
    pub group_key: String,
}
