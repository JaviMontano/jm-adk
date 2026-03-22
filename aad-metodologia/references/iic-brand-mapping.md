# IIC/kit → MetodologIA Brand Token Mapping

> Single source of truth for all CSS token replacements applied by `scripts/brand-overlay.sh`.

## CSS Custom Properties (:root)

| Token | IIC Original | MetodologIA | Notes |
|-------|-------------|-------------|-------|
| `--color-bg` | `#0f1117` | `#F8F9FC` | Off-white body bg |
| `--color-surface` | `#1a1d27` | `#FFFFFF` | White cards |
| `--color-surface-elevated` | `#222536` | `#F0F1F4` | Subtle elevated |
| `--color-surface-hover` | `#2a2d40` | `#E8EAF0` | Light gray hover |
| `--color-border` | `#2e3148` | `#E8EAF0` | Light gray borders |
| `--color-border-subtle` | `#252839` | `#F0F1F4` | Very subtle |
| `--color-text` | `#e8eaed` | `#1F2833` | Dark text |
| `--color-text-secondary` | `#9aa0b4` | `#5A5F72` | Medium gray |
| `--color-text-muted` | `#6b7189` | `#808080` | Muted gray |
| `--color-accent` | `#3B82F6` | `#137DC5` | MetodologIA blue |
| `--color-accent-hover` | `#60A5FA` | `#1A90D8` | Lighter blue |
| `--color-todo` | `#4a90d9` | `#137DC5` | Blue |
| `--color-inprogress` | `#f5a623` | `#D97706` | Warning amber |
| `--color-done` | `#27c93f` | `#137DC5` | **Blue, NEVER green** |
| `--color-verified` | `#27c93f` | `#137DC5` | **Blue, NEVER green** |
| `--color-p1` | `#ff4757` | `#DC2626` | Critical red |
| `--color-p2` | `#ffa502` | `#D97706` | Warning amber |
| `--color-p3` | `#3498db` | `#137DC5` | Blue |
| `--color-tampered` | `#ff4757` | `#DC2626` | Critical red |
| `--color-missing` | `#6b7189` | `#808080` | Gray |
| `--radius-sm` | `6px` | `8px` | Swiss 8px grid |
| `--radius-md` | `10px` | `12px` | Swiss 8px grid |
| `--radius-lg` | `14px` | `16px` | Swiss 8px grid |
| `--shadow-card` | `rgba(0,0,0,...)` | `rgba(18,37,98,...)` | Navy-tinted |
| `--font-sans` | System stack | `Poppins, Segoe UI, Trebuchet MS` | Google Fonts |

## Dark Mode (`[data-theme="dark"]`)

| Token | MetodologIA Dark |
|-------|-----------------|
| `--color-bg` | `#122562` (navy) |
| `--color-surface` | `#1A2D6B` |
| `--color-text` | `#F8F9FC` |
| `--color-accent` | `#FFD700` (gold) |

## HTML Changes

| Element | Change |
|---------|--------|
| `<title>` | `IIC Dashboard — MetodologIA` |
| Logo | MetodologIA SVG (squircle + pillars + gold circle) |
| Wordmark | `IIC by metodologIA` (gold "IA") |
| Header | Navy top border + gold bottom border |
| Footer | Navy bg, gold top border, MetodologIA branding |
| Fonts | Google Fonts: Poppins + JetBrains Mono |
| Focus | Gold `#FFD700` 2px outline |

## Prohibited Tokens

These MUST NOT appear in any branded template:
- `#27c93f` (green) — replaced by `#137DC5` (blue)
- `#22c55e` (green) — replaced by `#137DC5` (blue)
- `#0f1117` (IIC dark bg) — replaced by `#F8F9FC`
