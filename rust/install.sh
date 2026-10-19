#!/usr/bin/env bash
set -euo pipefail

APP=cogit
REPO=anurag-p6/cogit

MUTED='\033[0;2m'
RED='\033[0;31m'
CYAN='\033[96;1m'
NC='\033[0m'

if ! [ -t 1 ] || [ -n "${NO_COLOR-}" ]; then
    MUTED=''; RED=''; CYAN=''; NC=''
fi

usage() {
    cat <<EOF
Cogit Installer

Usage: install.sh [options]

Options:
    -h, --help              Display this help message
    -v, --version <version> Install a specific version (e.g. 0.1.0)
    -b, --binary <path>     Install from a local binary instead of downloading
        --no-modify-path    Don't modify shell config files (.bashrc, .zshrc, etc.)

Environment:
    COGIT_INSTALL_DIR       Install directory (default: \$HOME/.cogit/bin)
    GH_TOKEN / GITHUB_TOKEN GitHub token, needed only if the repo is private

Examples:
    curl -fsSL https://github.com/$REPO/releases/latest/download/install.sh | bash
    curl -fsSL https://github.com/$REPO/releases/latest/download/install.sh | bash -s -- --version 0.1.0
    ./install.sh --binary /path/to/cogit
EOF
}

requested_version=${VERSION:-}
no_modify_path=false
binary_path=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)
            usage
            exit 0
            ;;
        -v|--version)
            if [[ -n "${2:-}" ]]; then
                requested_version="$2"
                shift 2
            else
                echo -e "${RED}Error: --version requires a version argument${NC}" >&2
                exit 1
            fi
            ;;
        -b|--binary)
            if [[ -n "${2:-}" ]]; then
                binary_path="$2"
                shift 2
            else
                echo -e "${RED}Error: --binary requires a path argument${NC}" >&2
                exit 1
            fi
            ;;
        --no-modify-path)
            no_modify_path=true
            shift
            ;;
        *)
            echo -e "${RED}Warning: unknown option '$1'${NC}" >&2
            shift
            ;;
    esac
done

requested_version="${requested_version#v}"
INSTALL_DIR=${COGIT_INSTALL_DIR:-$HOME/.cogit/bin}
mkdir -p "$INSTALL_DIR"

curl_auth=()
if [ -n "${GH_TOKEN:-}" ]; then
    curl_auth=(-H "Authorization: Bearer $GH_TOKEN")
elif [ -n "${GITHUB_TOKEN:-}" ]; then
    curl_auth=(-H "Authorization: Bearer $GITHUB_TOKEN")
fi

print_message() {
    local level=$1
    local message=$2
    local color=""
    case $level in
        error) color="${RED}" ;;
        *) color="${NC}" ;;
    esac
    echo -e "${color}${message}${NC}"
}

print_progress() {
    local bytes="$1"
    local length="$2"
    [ "$length" -gt 0 ] || return 0

    local width=50
    local percent=$(( bytes * 100 / length ))
    [ "$percent" -gt 100 ] && percent=100
    local on=$(( percent * width / 100 ))
    local off=$(( width - on ))

    local filled=$(printf "%*s" "$on" "")
    filled=${filled// /■}
    local empty=$(printf "%*s" "$off" "")
    empty=${empty// /･}

    printf "\r${MUTED}%s%s %3d%%${NC}" "$filled" "$empty" "$percent" >&4
}

unbuffered_sed() {
    if echo | sed -u -e "" >/dev/null 2>&1; then
        sed -nu "$@"
    elif echo | sed -l -e "" >/dev/null 2>&1; then
        sed -nl "$@"
    else
        local pad="$(printf "\n%512s" "")"
        sed -ne "s/$/\\${pad}/" "$@"
    fi
}

download_with_progress() {
    local url="$1"
    local output="$2"

    if [ -t 2 ]; then
        exec 4>&2
    else
        exec 4>/dev/null
    fi

    local tmp_dir=${TMPDIR:-/tmp}
    local basename="${tmp_dir}/cogit_install_$$"
    local tracefile="${basename}.trace"

    rm -f "$tracefile"
    mkfifo "$tracefile"

    printf "\033[?25l" >&4
    trap "trap - RETURN; rm -f \"$tracefile\"; printf '\033[?25h' >&4; exec 4>&-" RETURN

    (
        curl "${curl_auth[@]+"${curl_auth[@]}"}" --trace-ascii "$tracefile" -f -s -L -o "$output" "$url"
    ) &
    local curl_pid=$!

    unbuffered_sed \
        -e 'y/ACDEGHLNORTV/acdeghlnortv/' \
        -e '/^0000: content-length:/p' \
        -e '/^<= recv data/p' \
        "$tracefile" | \
    {
        local length=0
        local bytes=0

        while IFS=" " read -r -a line; do
            [ "${#line[@]}" -lt 2 ] && continue
            local tag="${line[0]} ${line[1]}"

            if [ "$tag" = "0000: content-length:" ]; then
                length="${line[2]}"
                length=$(echo "$length" | tr -d '\r')
                bytes=0
            elif [ "$tag" = "<= recv" ]; then
                local size="${line[3]}"
                bytes=$(( bytes + size ))
                if [ "$length" -gt 0 ]; then
                    print_progress "$bytes" "$length"
                fi
            fi
        done
    }

    wait $curl_pid
    local ret=$?
    echo "" >&4
    return $ret
}

download() {
    local url="$1"
    local output="$2"

    if [[ "${os:-}" == "windows" ]] || ! [ -t 2 ] || ! download_with_progress "$url" "$output"; then
        curl "${curl_auth[@]+"${curl_auth[@]}"}" -f -L --progress-bar -o "$output" "$url"
    fi
}

verify_checksum() {
    local file="$1"
    local sums_file="$2"
    local name
    name=$(basename "$file")

    if ! curl "${curl_auth[@]+"${curl_auth[@]}"}" -fsSL --max-time 30 -o "$sums_file" "$base_url/SHA256SUMS"; then
        print_message info "${MUTED}Warning: SHA256SUMS not available, skipping checksum verification${NC}"
        return 0
    fi

    local expected
    expected=$(grep " ${name}\$" "$sums_file" | awk '{print $1}' | head -n 1)
    if [ -z "$expected" ]; then
        print_message info "${MUTED}Warning: ${name} not listed in SHA256SUMS, skipping checksum verification${NC}"
        return 0
    fi

    local actual=""
    if command -v sha256sum >/dev/null 2>&1; then
        actual=$(sha256sum "$file" | awk '{print $1}')
    elif command -v shasum >/dev/null 2>&1; then
        actual=$(shasum -a 256 "$file" | awk '{print $1}')
    else
        print_message info "${MUTED}Warning: no sha256 tool found, skipping checksum verification${NC}"
        return 0
    fi

    if [ "$expected" != "$actual" ]; then
        print_message error "Error: checksum verification failed for ${name}"
        return 1
    fi
    print_message info "${MUTED}Checksum verified${NC}"
}

check_existing() {
    if command -v "$APP" >/dev/null 2>&1; then
        local existing_path existing_version
        existing_path=$(command -v "$APP")
        existing_version=$("$APP" --version 2>/dev/null || echo "")

        if [ "$existing_path" = "$INSTALL_DIR/$APP" ] && [ "$existing_version" = "$specific_version" ]; then
            print_message info "${MUTED}Version ${NC}$specific_version${MUTED} already installed at ${NC}$existing_path"
            exit 0
        fi
        if [ "$existing_version" = "$specific_version" ]; then
            print_message info "${MUTED}Another $APP (v$existing_version) is at ${NC}$existing_path${MUTED}; the native binary will take precedence in new shells.${NC}"
        fi
    fi
}

install_from_binary() {
    print_message info "\n${MUTED}Installing ${NC}$APP ${MUTED}from: ${NC}$binary_path"
    cp "$binary_path" "$INSTALL_DIR/$APP"
    chmod 755 "$INSTALL_DIR/$APP"
    specific_version=$("$INSTALL_DIR/$APP" --version 2>/dev/null || echo "dev")
}

download_and_install() {
    print_message info "\n${MUTED}Installing ${NC}$APP ${MUTED}version: ${NC}$specific_version"
    local tmp_dir="${TMPDIR:-/tmp}/cogit_install_$$"
    mkdir -p "$tmp_dir"

    download "$base_url/$filename" "$tmp_dir/$filename"
    verify_checksum "$tmp_dir/$filename" "$tmp_dir/SHA256SUMS"

    tar -xzf "$tmp_dir/$filename" -C "$tmp_dir"
    mv "$tmp_dir/$APP" "$INSTALL_DIR/$APP"
    chmod 755 "$INSTALL_DIR/$APP"
    rm -rf "$tmp_dir"
}

if [ -n "$binary_path" ]; then
    if [ ! -f "$binary_path" ]; then
        echo -e "${RED}Error: binary not found at ${binary_path}${NC}" >&2
        exit 1
    fi
    install_from_binary
else
    raw_os=$(uname -s)
    case "$raw_os" in
        Darwin*) os="darwin" ;;
        Linux*) os="linux" ;;
        MINGW*|MSYS*|CYGWIN*) os="windows" ;;
        *) os=$(echo "$raw_os" | tr '[:upper:]' '[:lower:]') ;;
    esac

    arch=$(uname -m)
    case "$arch" in
        aarch64|arm64) arch="arm64" ;;
        x86_64|amd64) arch="x64" ;;
    esac

    if [ "$os" = "darwin" ] && [ "$arch" = "x64" ]; then
        rosetta_flag=$(sysctl -n sysctl.proc_translated 2>/dev/null || echo 0)
        if [ "$rosetta_flag" = "1" ]; then
            arch="arm64"
        fi
    fi

    filename="$APP-$os-$arch.tar.gz"

    if ! command -v curl >/dev/null 2>&1; then
        echo -e "${RED}Error: curl is required but not installed.${NC}" >&2
        exit 1
    fi
    if ! command -v tar >/dev/null 2>&1; then
        echo -e "${RED}Error: tar is required but not installed.${NC}" >&2
        exit 1
    fi

    if [ -z "$requested_version" ]; then
        specific_version=$(curl "${curl_auth[@]+"${curl_auth[@]}"}" -fsSL --max-time 30 "https://api.github.com/repos/$REPO/releases/latest" 2>/dev/null \
            | grep -o '"tag_name": *"[^"]*"' | head -n 1 \
            | sed 's/.*: *"v\?\([^"]*\)"$/\1/' || true)
        if [ -z "$specific_version" ]; then
            print_message error "Error: failed to fetch version information"
            echo -e "${MUTED}If the repository is private, pass a token (GH_TOKEN) or set an explicit --version.${NC}" >&2
            exit 1
        fi
    else
        specific_version=$requested_version
    fi

    base_url="https://github.com/$REPO/releases/download/v${specific_version}"

    http_status=$(curl "${curl_auth[@]+"${curl_auth[@]}"}" -sIL --max-time 30 -o /dev/null -w "%{http_code}" "$base_url/$filename" || true)
    if [ "$http_status" != "200" ]; then
        print_message error "Error: no release asset for $os/$arch at v${specific_version}"
        echo -e "${MUTED}Releases: https://github.com/$REPO/releases${NC}" >&2
        exit 1
    fi

    check_existing
    download_and_install
fi

add_to_path() {
    local config_file=$1
    local command=$2

    if grep -Fxq "$command" "$config_file"; then
        print_message info "${MUTED}Command already exists in ${NC}$config_file${MUTED}, skipping write.${NC}"
    elif [[ -w $config_file ]]; then
        echo -e "\n# cogit" >> "$config_file"
        echo "$command" >> "$config_file"
        print_message info "${MUTED}Added ${NC}$APP${MUTED} to \$PATH in ${NC}$config_file"
    else
        print_message info "Manually add the directory to $config_file (or similar):"
        print_message info "  $command"
    fi
}

XDG_CONFIG_HOME=${XDG_CONFIG_HOME:-$HOME/.config}

current_shell=$(basename "${SHELL:-/bin/sh}")
case $current_shell in
    fish)
        config_files="$HOME/.config/fish/config.fish"
        ;;
    zsh)
        config_files="${ZDOTDIR:-$HOME}/.zshrc ${ZDOTDIR:-$HOME}/.zshenv $XDG_CONFIG_HOME/zsh/.zshrc $XDG_CONFIG_HOME/zsh/.zshenv"
        ;;
    bash)
        config_files="$HOME/.bashrc $HOME/.bash_profile $HOME/.profile $XDG_CONFIG_HOME/bash/.bashrc $XDG_CONFIG_HOME/bash/.bash_profile"
        ;;
    ash|sh)
        config_files="$HOME/.ashrc $HOME/.profile /etc/profile"
        ;;
    *)
        config_files="$HOME/.bashrc $HOME/.bash_profile $XDG_CONFIG_HOME/bash/.bashrc $XDG_CONFIG_HOME/bash/.bash_profile"
        ;;
esac

if [[ "$no_modify_path" != "true" ]]; then
    config_file=""
    for file in $config_files; do
        if [[ -f $file ]]; then
            config_file=$file
            break
        fi
    done

    if [[ -z $config_file ]]; then
        print_message info "No config file found for $current_shell. You may need to manually add to PATH:"
        print_message info "  export PATH=$INSTALL_DIR:\$PATH"
    elif [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
        case $current_shell in
            fish)
                add_to_path "$config_file" "fish_add_path $INSTALL_DIR"
                ;;
            *)
                add_to_path "$config_file" "export PATH=$INSTALL_DIR:\$PATH"
                ;;
        esac
    fi
fi

if [ -n "${GITHUB_ACTIONS-}" ] && [ "${GITHUB_ACTIONS}" == "true" ]; then
    echo "$INSTALL_DIR" >> $GITHUB_PATH
    print_message info "Added $INSTALL_DIR to \$GITHUB_PATH"
fi

echo -e ""
echo -e "${CYAN} ██████╗ ██████╗  ██████╗ ██╗████████╗${NC}"
echo -e "${CYAN}██╔════╝ ██╔═══██╗██╔════╝ ██║╚══██╔══╝${NC}"
echo -e "${CYAN}██║      ██║   ██║██║  ███╗██║   ██║${NC}"
echo -e "${CYAN}██║      ██║   ██║██║   ██║██║   ██║${NC}"
echo -e "${CYAN}╚██████╗ ╚██████╔╝╚██████╔╝██║   ██║${NC}"
echo -e "${CYAN} ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝   ╚═╝${NC}"
echo -e ""
echo -e "${MUTED}$APP ${NC}$specific_version${MUTED} installed → ${NC}$INSTALL_DIR/$APP"
echo -e ""
echo -e "${MUTED}To get started:${NC}"
echo -e ""
echo -e "cd <project>           ${MUTED}# any project directory${NC}"
echo -e "$APP init <name>       ${MUTED}# create a repo + group key${NC}"
echo -e "$APP commit -m \"…\"     ${MUTED}# record encrypted context${NC}"
echo -e "$APP pull <branch>     ${MUTED}# verified context for agents${NC}"
echo -e ""
echo -e "${MUTED}Docs: ${NC}https://github.com/$REPO"
echo -e ""
