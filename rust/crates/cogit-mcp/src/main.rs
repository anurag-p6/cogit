mod server;

use rmcp::{ServiceExt, service::ServerInitializeError, transport::stdio};

use crate::server::CogitMcp;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let server = CogitMcp::new();
    let service = match server.serve(stdio()).await {
        Ok(service) => service,
        // A client that closes stdin before the initialize handshake (e.g.
        // `cogit-mcp < /dev/null`) is a normal shutdown, not a failure — the
        // TS server exits 0 here too.
        Err(ServerInitializeError::ConnectionClosed(_)) => {
            eprintln!("cogit mcp server ready (stdio)");
            return;
        }
        Err(err) => {
            eprintln!("cogit mcp fatal: {err}");
            std::process::exit(1);
        }
    };
    eprintln!("cogit mcp server ready (stdio)");
    if let Err(err) = service.waiting().await {
        eprintln!("cogit mcp fatal: {err}");
        std::process::exit(1);
    }
}
