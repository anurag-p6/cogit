use serde_json::Value;

use crate::types::{CommitBody, CommitEnvelope, LogRow, LogStatus};

pub fn short_hex(hex: &str, chars: usize) -> String {
    if hex.len() <= chars + 2 {
        hex.to_string()
    } else {
        format!("{}…", &hex[..chars])
    }
}

pub fn format_ts(ts: u64) -> String {
    match chrono::DateTime::from_timestamp(ts as i64, 0) {
        Some(dt) => dt.format("%Y-%m-%d %H:%M UTC").to_string(),
        None => ts.to_string(),
    }
}

pub fn render_commit_section(envelope: &CommitEnvelope, body: &CommitBody) -> String {
    let mut lines: Vec<String> = Vec::new();
    lines.push(format!("## [{}] {}", envelope.kind, body.summary));
    lines.push(String::new());
    lines.push(format!(
        "_{} · {} · {} · {}_",
        format_ts(envelope.ts),
        envelope.agent,
        short_hex(&envelope.author, 8),
        short_hex(&envelope.commit_hash, 10)
    ));
    lines.push(String::new());
    if !body.details.trim().is_empty() {
        lines.push(body.details.trim().to_string());
        lines.push(String::new());
    }
    if !body.tags.is_empty() {
        let tags: Vec<String> = body.tags.iter().map(|t| format!("`{t}`")).collect();
        lines.push(format!("tags: {}", tags.join(" ")));
        lines.push(String::new());
    }
    lines.push("---".to_string());
    lines.push(String::new());
    lines.join("\n")
}

pub fn render_pull_markdown(
    repo_name: &str,
    branch: &str,
    sections: &[String],
    invalid_count: usize,
) -> String {
    let mut lines: Vec<String> = Vec::new();
    lines.push(format!("# {repo_name} — {branch} context"));
    lines.push(String::new());
    lines.push(format!(
        "_pulled {} · {} verified commit(s)_",
        format_ts(crate::envelope::now_secs()),
        sections.len()
    ));
    if invalid_count > 0 {
        lines.push(String::new());
        lines.push(format!(
            "> ⚠ {invalid_count} invalid commit(s) skipped — run `cogit log` for reasons"
        ));
    }
    lines.push(String::new());
    if sections.is_empty() {
        lines.push("_no verified commits yet_".to_string());
        lines.push(String::new());
    }
    let mut all = lines;
    all.extend(sections.iter().cloned());
    all.join("\n")
}

pub fn render_log_line(row: &LogRow) -> String {
    let status = match row.status {
        LogStatus::Verified => "verified".to_string(),
        LogStatus::Invalid => format!(
            "INVALID:{}",
            row.reason.map(|r| r.as_str()).unwrap_or("UNKNOWN")
        ),
    };
    let summary = row.summary.clone().unwrap_or_default();
    let detail = match row.status {
        LogStatus::Verified => String::new(),
        LogStatus::Invalid => format!(" ({})", row.detail.clone().unwrap_or_default()),
    };
    format!(
        "{status:<22} {hash:<14} {ts}  [{kind}] {branch} {author:<10} {summary}{detail}",
        hash = short_hex(&row.commit_hash, 12),
        ts = format_ts(row.ts),
        kind = row.kind,
        branch = row.branch,
        author = short_hex(&row.author, 8),
    )
    .trim_end()
    .to_string()
}

pub(crate) fn value_to_string(value: &Value) -> Option<String> {
    match value {
        Value::String(s) => Some(s.clone()),
        Value::Number(n) => Some(n.to_string()),
        Value::Bool(b) => Some(b.to_string()),
        Value::Object(map) => map.get("value").and_then(value_to_string),
        _ => None,
    }
}
