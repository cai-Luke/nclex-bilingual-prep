# GPT Raw-Bank MCP Handoff - 2026-06-23

Purpose: let ChatGPT stage completed NCLEX bank JSON into Project Shrimp's raw quarantine directory only:

`/Users/holemini/Desktop/Project Shrimp/banks/banks-raw/`

This connector is for writing raw drafts. It does not review, promote, consolidate, commit, push, or make study material.

## Implemented

- Server entry point: `scripts/raw-bank-mcp.ts`
- Start command from repo root:

```sh
npm run raw-bank-mcp
```

- Transport: stdio MCP server. Prefer connecting it through OpenAI Secure MCP Tunnel using `tunnel-client --mcp-command`, not a public HTTP listener.
- Tools exposed:
  - `write_raw_bank_json(filename, json_text, overwrite=false)` - write tool
  - `list_raw_bank_files()` - read-only
  - `read_raw_bank_file(filename)` - read-only
  - `validate_raw_bank_file(filename)` - read-only

## Write Jail

The server hardcodes:

- `REPO = /Users/holemini/Desktop/Project Shrimp`
- `RAW_DIR = /Users/holemini/Desktop/Project Shrimp/banks/banks-raw`

No tool accepts a directory or arbitrary path. Filenames must be non-hidden `.json` basenames. The server rejects slashes, backslashes, absolute paths, `..`, hidden names, non-JSON suffixes, symlink targets, non-regular existing targets, JSON parse failures, and payloads over 2 MiB.

When `overwrite` is false, target creation is reserved with `O_CREAT | O_EXCL`. Writes use a temp file inside `RAW_DIR`, fsync, and rename.

## Validator Helper

`validate_raw_bank_file` runs only the fixed validator command:

```sh
'/Users/holemini/Desktop/Project Shrimp/node_modules/.bin/tsx' scripts/validate-bank.ts <resolved raw-bank file>
```

with `cwd=/Users/holemini/Desktop/Project Shrimp`, a timeout, no shell, and no caller-supplied extra arguments.

## ChatGPT Connector Setup

1. Create or select an OpenAI Secure MCP Tunnel for this server.
2. Initialize `tunnel-client` with the stdio server command, for example:

```sh
tunnel-client init \
  --profile project-shrimp-raw-bank \
  --tunnel-id <TUNNEL_ID> \
  --mcp-command "npm --prefix '/Users/holemini/Desktop/Project Shrimp' run raw-bank-mcp"
```

3. Run:

```sh
tunnel-client doctor --profile project-shrimp-raw-bank --explain
tunnel-client run --profile project-shrimp-raw-bank
```

4. In ChatGPT, create a Developer Mode connector using Tunnel mode and `<TUNNEL_ID>`.
5. Confirm the tool list shows exactly the four tools above. It must not show `write_file`, `edit_file`, shell, git, or broad filesystem tools.

## GPT Usage Rules

- Use the GitHub connector for committed repo reads if needed.
- Use this MCP connector only to write completed JSON drafts into `banks/banks-raw/`.
- Do not verify a raw write by reading GitHub. Raw files are local and ignored until promoted and pushed.
- Treat every file written here as raw, unreviewed material.
- Use `validate_raw_bank_file` only as a structural sanity check. Passing validation is not clinical review.
- Do not ask this connector to promote, consolidate, update the ledger, commit, or push. Those actions remain outside ChatGPT.

## Smoke Test

After connecting from ChatGPT:

1. Ask it to list available tools.
2. Confirm only these four tools appear.
3. Call `write_raw_bank_json` with:

```json
{
  "filename": "smoketest-<timestamp>.json",
  "json_text": "{\"meta\":{\"schemaVersion\":\"1.6\",\"count\":0},\"questions\":[]}",
  "overwrite": false
}
```

4. Confirm the returned path is under `banks/banks-raw/`, byte count is present, and shape summary shows object keys `meta` and `questions`.
5. Optionally call `validate_raw_bank_file` on the smoke file.
6. Delete the smoke file locally after the test.

## Local Verification Already Run

- `npm run build` passed.
- MCP client smoke test listed exactly:
  - `write_raw_bank_json`
  - `list_raw_bank_files`
  - `read_raw_bank_file`
  - `validate_raw_bank_file`
- Smoke write/read/validate passed with a valid empty bank.
- Duplicate write with `overwrite:false` returned a tool error.
- Traversal filename `../package.json` returned a tool error.
