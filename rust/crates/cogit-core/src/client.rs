use anyhow::{Context, Result};
use arkiv_sdk::{DynProvider, PrivateKeySigner, Provider as _, ProviderBuilder, Url};

pub const CHAIN_ID: u64 = 7_738_577;
pub const DEFAULT_RPC: &str = "https://rpc.tiramisu.db-chain.testnet.arkiv.network";

pub fn rpc_url() -> String {
    std::env::var("ARKIV_RPC_URL").unwrap_or_else(|_| DEFAULT_RPC.to_string())
}

fn parsed_url() -> Result<Url> {
    rpc_url().parse().context("invalid ARKIV_RPC_URL")
}

pub fn read_provider() -> Result<DynProvider> {
    Ok(ProviderBuilder::new()
        .with_chain_id(CHAIN_ID)
        .connect_http(parsed_url()?)
        .erased())
}

pub struct WalletContext {
    pub provider: DynProvider,
    pub signer: PrivateKeySigner,
    pub address: String,
}

pub fn wallet_context() -> Result<WalletContext> {
    let pk = std::env::var("PRIVATE_KEY").context(
        "PRIVATE_KEY is not set — put it in .env or the shell environment (see .env.example)",
    )?;
    let signer: PrivateKeySigner = pk
        .trim()
        .parse()
        .context("PRIVATE_KEY is not a valid hex private key")?;
    let address = signer.address().to_string();
    let provider = ProviderBuilder::new()
        .with_chain_id(CHAIN_ID)
        .wallet(signer.clone())
        .connect_http(parsed_url()?)
        .erased();
    Ok(WalletContext {
        provider,
        signer,
        address,
    })
}
