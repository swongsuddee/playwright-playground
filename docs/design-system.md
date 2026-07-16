# Design System — "Bussar" CI (from Figma)

Status: **approved for implementation** · Source: Figma "Modern & Simple Full Website UI
Design" (node `117:2`), extracted via the Figma Dev Mode MCP server.

A warm, friendly, **rounded, soft-elevated** modern-agency look: orange primary, periwinkle
indigo secondary, playful coral/sky accents, generous whitespace. This is the designer→
implementer handoff — the web-implementer applies these tokens to `src/app/globals.css`.

## Foundations
- **Font:** DM Sans — ExtraBold (800) display headings · SemiBold (600) subheads · Medium
  (500) buttons/labels · Regular (400) body. Load via `<link>` (static-export safe).
- **Type scale (px):** 70 hero · 38–42 section · 26–28 sub · 20 button · 16 body · 14 small.
  App headers stay compact (`.h1` ≈ 18/800, `.h2` ≈ 15/700); the big display sizes are for
  marketing-style surfaces only.
- **Shape:** rounded & soft. `--radius` 16 (buttons/inputs), `--radius-lg` 24 (cards/panels),
  `--radius-sm` 12; pills 999. **Soft low-alpha shadows**, not flat borders alone.

## Tokens (light / dark)

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#fafafa` | `#131318` |
| `--surface` | `#ffffff` | `#1c1c22` |
| `--surface-2` | `#f5f4f5` | `#24242c` |
| `--surface-3` | `#ececec` | `#2e2e37` |
| `--text` | `#17171b` | `#f4f4f6` |
| `--text-muted` | `#5c5c66` | `#a7a7b2` |
| `--text-faint` | `#9a9aa4` | `#72727c` |
| `--border` | `#ededec` | `#2b2b33` |
| `--border-strong` | `#e2e0e0` | `#3a3a44` |
| `--accent` | `#ffa54e` | `#ffb266` |
| `--accent-hover` | `#f2921f` | `#ffc487` |
| `--accent-soft` | `#fff3e6` | `rgba(255,165,78,0.15)` |
| `--accent-border` | `#ffd7ac` | `rgba(255,165,78,0.36)` |
| `--accent-text` | `#b15e12` | `#ffc48c` |
| `--accent-contrast` | `#ffffff` | `#2a1a08` |
| `--secondary` | `#9a9eff` | `#b1b4ff` |
| `--secondary-soft` | `#eeeeff` | `rgba(154,158,255,0.16)` |
| `--secondary-border` | `#d3d4ff` | `rgba(154,158,255,0.36)` |
| `--secondary-text` | `#5a5ee0` | `#c3c5ff` |
| `--ring` | `rgba(255,165,78,0.32)` | `rgba(255,178,102,0.42)` |
| `--success` / soft / border | `#1a9d63` / `#e9f9f0` / `#b6ecd0` | `#35c88a` / `rgba(53,200,138,.14)` / `rgba(53,200,138,.32)` |
| `--danger` / soft / border | `#e5484d` / `#fdedee` / `#f7c9cb` | `#ff6b6f` / `rgba(229,72,77,.16)` / `rgba(229,72,77,.4)` |
| `--warn` | `#e08a1e` | `#f0a94a` |
| `--code-bg` / text / border | `#f5f4f5` / `#1f1f24` / `#e6e4e4` | `#1c1c22` / `#e6e6ea` / `#2b2b33` |
| `--shadow-sm` | `0 1px 2px rgba(17,17,26,.06)` | `0 1px 2px rgba(0,0,0,.5)` |
| `--shadow` | `0 8px 24px rgba(17,17,26,.07)` | `0 10px 28px rgba(0,0,0,.55)` |
| `--shadow-lg` | `0 20px 48px rgba(17,17,26,.12)` | `0 24px 56px rgba(0,0,0,.6)` |

Playful category accents (for Scratch/maze/legends): `--c-coral #ff7a7a`, `--c-sky #91d4ff`,
`--c-indigo #9a9eff`, `--c-amber #fdc161` (nudge lighter in dark: coral `#ff9a9a`, sky
`#aee0fb`).

## Component rules
- **`.btn`** radius 16, Medium weight; **`.btnPrimary`** = `--accent` bg + `--accent-contrast`
  text, hover `--accent-hover`; **`.btnSecondary`**/default = `--surface` bg + `--border-strong`,
  hover `--surface-2`. Focus ring `--ring`.
- **`.card`** = `--surface` + 1px `--border` + `--radius-lg` + `--shadow-sm`.
- **`.panel`** = `--surface` + `--border` + `--radius-lg` + `--shadow`.
- **`.input`/`.select`** radius 16, `--border-strong`, focus `--accent` + ring.
- **`.badge`/`.chip`** pill; **`.sidebar`/`.navItem`** rounded, active = `--accent-soft` +
  `--accent-text` + `--accent-border`.
- Seat "selected" & progress bars use `--accent`; dots/legends can use the category accents.

## Contrast notes (WCAG)
- The Figma uses **white text on `#ffa54e`** for the primary button (~2.0:1 — below AA for
  text). We keep it for brand fidelity on large/medium-weight button labels only. For orange
  **as text on a surface**, use `--accent-text` (`#b15e12` light / `#ffc48c` dark), which
  passes AA — never `--accent` for body-size text.
- In dark mode the primary button flips to **dark text (`--accent-contrast #2a1a08`) on the
  lighter orange** — that passes AA, unlike white-on-orange.
- Body text `--text-muted` on `--surface` passes AA in both themes.

## Notes for the implementer
- App structure unchanged; this is a token + component-style swap. Keep light+dark and the
  3-breakpoint shell.
- `--block-*` / `--grid-*` tokens from the deleted robot-coder are likely unused now — grep
  before keeping; drop if dead. The maze and Scratch categories carry their own brand data.
