# Billline — Linear-Style Minimal Dark UI (v3)

## Direction (confirmed with user)
Match **Linear** (linear.app) design language. Flat, quiet, engineered. Premium comes from
restraint: hairline borders, near-black surfaces, one accent, perfect spacing, precise type.
**The previous v2 (dark + gold + glass + grain) was rejected as a "cheap template" — this spec
removes ALL of it.**

## Hard rules (no exceptions)
- NO gradients (buttons, text, backgrounds)
- NO glow / box-shadow bloom on cards or buttons
- NO glassmorphism (no backdrop-filter, no translucent panels)
- NO grain, noise, dot-grid, or aurora effects
- NO drop shadows under panels
- NO serif display font (drop Playfair)
- NO gold / warm accents
- Cards do NOT lift on hover
- Print output stays clean white (not cream)

## Design tokens (Linear-derived)

### Color
- Background: `#0d0e10`
- Surface (panels): `#121316` (flat, opaque)
- Surface raised (inputs/rows): `#181a1d`
- Hover surface: `#1b1d20`
- Hairline border: `rgba(255,255,255,0.08)`
- Hairline border strong: `rgba(255,255,255,0.14)`
- Text primary: `#ededed`
- Text secondary: `#8a8f98`
- Text muted: `#5c6370`
- Accent (only one): indigo `#5e6ad2`
  - accent hover: `#4f5ec5`
  - accent text on dark: `#a5b0f0`
- Danger: `#e5484d`

### Typography
- UI + headings: **Inter** (400/500/600/700), tight `letter-spacing: -0.01em` for titles
- Numerals/tables: **JetBrains Mono** (tabular)
- Eyebrow labels: Inter 11px, 500, uppercase, `letter-spacing: 0.08em`, color text-muted

### Shape & space
- Radius: 8px (buttons/inputs), 10px (panels), 4px (badges)
- Panel padding: 20px 22px
- Focus ring: `0 0 0 2px #0d0e10, 0 0 0 4px #5e6ad2` (soft indigo ring, no blur)
- No shadows anywhere except the floating preview paper (needed for separation on dark)

### Components
- **Buttons:** flat. Primary = solid indigo `#5e6ad2`, white text, no border, hover darker.
  Secondary = transparent, 1px hairline, secondary text, hover surface. 13px, weight 500.
- **Inputs:** flat `#0a0b0c` field, 1px hairline, radius 6px, 14px text, focus = indigo ring only.
- **Header:** sticky, bg `rgba(13,14,16,0.9)`, bottom 1px hairline, subtle blur ok (transparency only, no glow).
- **Sheet paper (preview):** pure white `#ffffff`, dark text `#18181b`, 1px hairlines `#e4e4e7` for table rows, total in bold dark. ONLY element with a real drop shadow (dark backdrop separation): `0 0 0 1px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.5)`.
- **Totals:** plain right-aligned block, hairline rule above total row, total in 700 weight.
- **Empty state:** muted centered text, thin hairline frame.

## The one accent
Indigo `#5e6ad2` appears ONLY on: primary button, focus rings, active nav, the live-pulse dot,
"PRO" badge, logo dropzone hover. Everything else is monochrome.

## Non-negotiable feel
"Quiet, expensive, engineered." If a decision adds decoration, it's wrong.
