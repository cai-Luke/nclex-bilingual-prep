# Claude fsmcp Deferred Handoff - 2026-06-23

Luke approved building the new scoped GPT raw-bank writer now, but explicitly deferred disabling the existing broad filesystem MCP because Claude is currently using it.

## Current Existing Service

Local inspection on 2026-06-23 found:

- LaunchAgent: `/Users/holemini/Library/LaunchAgents/com.lukecai.fsmcp.plist`
- Start script: `/Users/holemini/mcp-servers/fsmcp/start.sh`
- Command:

```sh
/opt/homebrew/bin/supergateway \
  --port 8811 \
  --cors \
  --stateful \
  --outputTransport streamableHttp \
  --streamableHttpPath "/mcp" \
  --stdio "/opt/homebrew/bin/mcp-server-filesystem /Users/holemini"
```

- `lsof` showed `node` listening on `*:8811`, not loopback-only.
- Cloudflare ingress in `/Users/holemini/.cloudflared/gdrive-mcp.yml` maps:

```yaml
- hostname: fsmcp.lukecai.com
  service: http://localhost:8811
```

- A public request to `https://fsmcp.lukecai.com/mcp` reached the MCP gateway and returned `Invalid or missing session ID`, not a Cloudflare Access login page. Treat this as reachable until Access policy is separately proven.

## New Scoped Replacement For GPT

Codex added a separate server for ChatGPT raw-bank writes:

- `scripts/raw-bank-mcp.ts`
- `npm run raw-bank-mcp`
- Hardcoded write jail: `banks/banks-raw/`
- Exposes only:
  - `write_raw_bank_json`
  - `list_raw_bank_files`
  - `read_raw_bank_file`
  - `validate_raw_bank_file`

This does not replace Claude's current repo access yet.

## Suggested Claude Migration Path

When ready, move Claude off the broad home-dir filesystem server using one of these options:

1. Preferred: a purpose-built Project Shrimp MCP with only the repo read/write tools Claude actually needs.
2. Acceptable interim: relaunch `mcp-server-filesystem` scoped only to `/Users/holemini/Desktop/Project Shrimp`.
3. If Claude only needs content staging, use the new raw-bank writer and GitHub reads instead of broad filesystem.

After migration:

1. Stop `com.lukecai.fsmcp`.
2. Remove or narrow `/Users/holemini/mcp-servers/fsmcp/start.sh`.
3. Remove `fsmcp.lukecai.com` from Cloudflare ingress, or put a verified Access policy in front of it.
4. Confirm ChatGPT/Claude no longer see generic filesystem tools at `/Users/holemini` scope.

## Risk Statement

The new GPT raw-bank writer bounds GPT's direct write damage to `.json` files inside `banks/banks-raw/`. The older `fsmcp` service remains the broader environment risk until Claude's workflow is migrated.

