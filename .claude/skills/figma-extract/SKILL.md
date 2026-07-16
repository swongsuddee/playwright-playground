---
name: figma-extract
description: >
  Read a Figma design from the local Figma Dev Mode MCP server over plain HTTP (no MCP client
  needed) and turn it into design tokens for this repo. Use when someone shares a Figma
  `/design/` link or asks to extract colors/typography/spacing/components from Figma. Covers
  the JSON-RPC handshake via curl, the useful tools, saving screenshots without blowing up
  context, and mapping Figma values to this repo's CSS-variable token system.
---

# Extract a design from Figma (Dev Mode MCP over HTTP)

The Figma desktop app runs a **Dev Mode MCP server** at `http://127.0.0.1:3845/mcp` when the
file is open. It speaks MCP over Streamable HTTP, so you can drive it with `curl` even when
it isn't registered as an MCP client in this session.

## Node id from a URL
`…/design/:fileKey/:name?node-id=117-2` → nodeId **`117:2`** (dash → colon).

## Handshake (once) — capture the session id
```bash
curl -sS -D - -o /tmp/init.txt -X POST http://127.0.0.1:3845/mcp \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"cc","version":"1"}}}' | grep -i mcp-session-id
```
Then send the required `initialized` notification, reusing the `mcp-session-id` header on
**every** later call:
```bash
SID=<from above>; URL=http://127.0.0.1:3845/mcp
H=(-H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' -H "mcp-session-id: $SID")
curl -sS -X POST "$URL" "${H[@]}" -d '{"jsonrpc":"2.0","method":"notifications/initialized"}' >/dev/null
```
Responses are SSE — strip with `sed -n 's/^data: //p'` then `JSON.parse`; the payload is
`result.content[]` (text items, or an image item with base64 `data`).

## The tools that matter
- `get_metadata {nodeId}` — XML of structure (ids, names, sizes). Map the page before drilling in.
- `get_design_context {nodeId, forceCode:true}` — reference code (Tailwind-ish JSX) that
  carries the **real hex, fonts, radii, sizes**. Best source when the file has no variables.
- `get_variable_defs {nodeId}` — bound variables (`{token: value}`) — empty `{}` means the
  file uses raw fills/text styles; fall back to `get_design_context`.
- `get_screenshot {nodeId}` — PNG. **Save the base64 to a file, then Read the file** — never
  print base64 into the conversation.

## Extract the whole palette in one pass
Pull `get_design_context` on the top frame and tally values instead of printing the code:
```bash
curl -sS -X POST "$URL" "${H[@]}" -d '{"jsonrpc":"2.0","id":8,"method":"tools/call","params":{"name":"get_design_context","arguments":{"nodeId":"117:2","forceCode":true}}}' \
 | sed -n 's/^data: //p' | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const t=(JSON.parse(s).result.content||[]).filter(i=>i.type==="text").map(i=>i.text).join("\n");const tally=re=>{const m={};let x;while((x=re.exec(t)))m[x[0]]=(m[x[0]]||0)+1;return Object.entries(m).sort((a,b)=>b[1]-a[1])};console.log("HEX",tally(/#[0-9a-fA-F]{6,8}\b/g));console.log("FONTS",tally(/font-\[.[^\]]*\]/g));console.log("RADII",tally(/rounded-\[[0-9]+px\]|rounded-full/g));})'
```
Save a screenshot the same way (write `Buffer.from(item.data,"base64")` to a `.png`), then Read it.

## Save the screenshot to a file (don't print base64)
```bash
curl -sS -X POST "$URL" "${H[@]}" -d '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"get_screenshot","arguments":{"nodeId":"117:2"}}}' \
 | sed -n 's/^data: //p' | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const fs=require("fs");for(const i of JSON.parse(s).result.content){if(i.type==="image"&&i.data)fs.writeFileSync("/abs/path/shot.png",Buffer.from(i.data,"base64"))}})'
```

## Map to this repo's tokens
Frequency-rank the hex values: the most-used accent → `--accent` (+ hover/soft/border/text
derivatives), the second hue → `--secondary`, near-black text alphas → `--text/--text-muted/
--text-faint`, light grays → `--border/--border-strong/--surface-2`, page bg → `--bg`.
Fonts → the family to load; radii → `--radius*`; low-alpha drop shadows → `--shadow*`. Then
hand the values to the **web-designer** to finalize light+dark + contrast, and the
**web-implementer** to apply. Troubleshooting: no response → the Figma desktop app isn't open
or Dev Mode MCP is off; `{}` from variables → use `get_design_context` instead.
