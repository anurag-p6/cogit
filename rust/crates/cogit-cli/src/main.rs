mod commands;
mod welcome;

use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(
    name = "cogit",
    version = env!("CARGO_PKG_VERSION"),
    about = "Encrypted, wallet-signed team context on Arkiv"
)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// create a repo (plus main branch) and write .cogit/config.json
    Init { name: String },
    /// add a member to the repo and print an invite string
    Invite { address: String },
    /// join a repo from a cogit1: invite string
    Join { invite: String },
    /// create a branch forked from the current branch head
    Branch { name: String },
    /// switch the current branch
    Use { branch: String },
    /// commit an encrypted, wallet-signed context entry to the current branch
    Commit {
        /// one-line summary
        #[arg(short, long)]
        message: String,
        /// markdown details from a file
        #[arg(long)]
        details_file: Option<String>,
        /// one of: scratch, note, decision, milestone
        #[arg(long, default_value = "note")]
        kind: String,
        /// tags (space separated or repeated)
        #[arg(long = "tag", num_args = 1..)]
        tags: Vec<String>,
    },
    /// verified markdown for a branch (oldest first) → stdout + .cogit/context/<branch>.md
    Pull {
        branch: String,
        /// write here instead of .cogit/context/<branch>.md
        #[arg(long)]
        out: Option<String>,
        /// only commits of this kind
        #[arg(long)]
        kind: Option<String>,
        /// only commits carrying this tag
        #[arg(long)]
        tag: Option<String>,
    },
    /// list commits with verified/invalid status
    Log {
        /// only this branch
        #[arg(long)]
        branch: Option<String>,
    },
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let args: Vec<String> = std::env::args().collect();
    if args.len() <= 1 {
        println!("{}", welcome::render_welcome());
        return;
    }
    // Match commander's `cogit --version` output (bare version string).
    if args.len() == 2 && (args[1] == "--version" || args[1] == "-V") {
        println!("{}", env!("CARGO_PKG_VERSION"));
        return;
    }

    let cli = Cli::parse();
    let result = match cli.command {
        Command::Init { name } => commands::run_init(&name).await,
        Command::Invite { address } => commands::run_invite(&address).await,
        Command::Join { invite } => commands::run_join(&invite).await,
        Command::Branch { name } => commands::run_branch(&name).await,
        Command::Use { branch } => commands::run_use(&branch).await,
        Command::Commit {
            message,
            details_file,
            kind,
            tags,
        } => {
            commands::run_commit(&commands::CommitOptions {
                message,
                details_file,
                kind,
                tags,
            })
            .await
        }
        Command::Pull {
            branch,
            out,
            kind,
            tag,
        } => commands::run_pull(&branch, &commands::PullOptions { out, kind, tag }).await,
        Command::Log { branch } => commands::run_log(&commands::LogOptions { branch }).await,
    };

    if let Err(err) = result {
        eprintln!("error: {err}");
        std::process::exit(1);
    }
}
