# 404lab MCP server

A stdio MCP server for the 404lab library. It lets an assistant list and search
the 56 pages, read a page's real component source, pull the shared chrome and
tokens, and get the install command, without leaving the editor.

Works with Claude Code, Codex, Cursor, OpenCode, or any client that speaks MCP
over stdio.

## Tools

| tool | what it returns |
| --- | --- |
| `list_pages` | every page, optionally filtered by `scene`, `type` or `interactive`, with paging |
| `search_pages` | pages ranked against a word or phrase, including notes and animation methods |
| `get_page` | one page: category, method, note, install command, export name and full component source |
| `get_shared_file` | `chrome.tsx` or `tokens.css`, the two files every page imports |
| `get_install_guide` | prerequisites, the shadcn command and the manual copy path |
| `get_agent_skill` | the `SKILL.md` instructions for installing and wiring 404lab pages |

It also exposes resources: `lab404://library` for the catalog,
`lab404://pages/<slug>` for a single page, and `lab404://skill` for the agent skill. The URI scheme starts with a letter
on purpose, since URL parsers reject schemes that start with a digit.

## Run it

```bash
npm install          # once, installs the MCP SDK
npm run mcp          # starts the server on stdio
```

Check it before wiring a client:

```bash
npm run mcp:test     # initializes the server and reads one page
```

The server reads `mcp/data/pages.json`, which is generated from `lib/pages.tsx`
and `components/demos/`. Rebuild it after editing a demo:

```bash
npm run mcp:data     # rewrite the data file
npm run mcp:check    # exit 1 when the data file is stale
```

`npm run build` regenerates the data before the Next build, so the site and the
server never drift.

## Client setup

Replace `/path/to/404lab` with the absolute path to this repository. Node 20 or
newer is required. Use the security scope your client documents: these configs
give an assistant read access to the library source only, nothing else.

### Claude Code

```bash
claude mcp add 404lab -- node /path/to/404lab/mcp/server.mjs
```

Or commit a project file, `.mcp.json`:

```json
{
  "mcpServers": {
    "404lab": {
      "command": "node",
      "args": ["/path/to/404lab/mcp/server.mjs"]
    }
  }
}
```

### Codex

Add to `~/.codex/config.toml`:

```toml
[mcp_servers.404lab]
command = "node"
args = ["/path/to/404lab/mcp/server.mjs"]
```

Or use the CLI:

```bash
codex mcp add 404lab -- node /path/to/404lab/mcp/server.mjs
```

### Cursor

Add to `.cursor/mcp.json` in the project, or `~/.cursor/mcp.json` for every
project:

```json
{
  "mcpServers": {
    "404lab": {
      "command": "node",
      "args": ["/path/to/404lab/mcp/server.mjs"]
    }
  }
}
```

### OpenCode

Add to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "404lab": {
      "type": "local",
      "command": ["node", "/path/to/404lab/mcp/server.mjs"],
      "enabled": true
    }
  }
}
```

## Examples

```text
Find a 404 page built around water and add it to this project.
Show me the source for magnet-404, then write it to components/404lab.
Pull the tokens file and tell me where it goes.
List the interactive pages and pick the quietest one.
```

## Notes

- The install command assumes the registry is reachable. If `npx shadcn` cannot
  find `@404lab/<slug>`, use `get_page` and copy the three files instead.
- The server is read-only. It never writes to the client project; the assistant
  does that with its own file tools.
- Pages need `motion`, Tailwind v4 and the tokens in `tokens.css`.
- Fonts are controlled by `--lab-font-display` and `--lab-font-mono`, so a page
  can be restyled without touching its component code.
