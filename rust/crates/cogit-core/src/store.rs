use std::{
    env, fs,
    path::{Path, PathBuf},
};

use anyhow::{Context, Result, bail};

use crate::config::{COGIT_DIR, CONFIG_FILE, CONTEXT_DIR};
use crate::types::RepoConfig;

pub fn project_dir() -> PathBuf {
    env::var_os("COGIT_HOME")
        .map(PathBuf::from)
        .unwrap_or_else(|| env::current_dir().expect("cannot determine current directory"))
}

pub fn config_path() -> PathBuf {
    project_dir().join(COGIT_DIR).join(CONFIG_FILE)
}

pub fn read_config() -> Result<RepoConfig> {
    let path = config_path();
    if !path.exists() {
        bail!(
            "no {COGIT_DIR}/{CONFIG_FILE} here — run `cogit init <name>` or `cogit join <invite>` first"
        );
    }
    let text =
        fs::read_to_string(&path).with_context(|| format!("cannot read {}", path.display()))?;
    serde_json::from_str(&text).context("invalid .cogit/config.json")
}

pub fn write_config(config: &RepoConfig) -> Result<PathBuf> {
    let dir = project_dir().join(COGIT_DIR);
    fs::create_dir_all(&dir)?;
    let path = dir.join(CONFIG_FILE);
    let json = format!("{}\n", serde_json::to_string_pretty(config)?);
    write_private(&path, json.as_bytes())?;
    Ok(path)
}

pub fn write_context_file(branch: &str, content: &str) -> Result<PathBuf> {
    let dir = project_dir().join(COGIT_DIR).join(CONTEXT_DIR);
    fs::create_dir_all(&dir)?;
    let path = dir.join(format!("{branch}.md"));
    fs::write(&path, content)?;
    Ok(path)
}

#[cfg(unix)]
fn write_private(path: &Path, bytes: &[u8]) -> Result<()> {
    use std::io::Write as _;
    use std::os::unix::fs::OpenOptionsExt as _;
    let mut file = fs::OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .mode(0o600)
        .open(path)?;
    file.write_all(bytes)?;
    Ok(())
}

#[cfg(not(unix))]
fn write_private(path: &Path, bytes: &[u8]) -> Result<()> {
    fs::write(path, bytes)?;
    Ok(())
}
