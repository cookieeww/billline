# Luxury & Ultra-Modern UI Design System — Billline (v2: DARK LUXURY)

## Mandate (from skill_money.md §5)
The UI MUST look expensive and current. Plain white/grey default design is a FAILING criterion.

## Visual Direction
A dark, high-end fintech/private-banking aesthetic — think Stripe's dark mode, Linear, Revolut, Mercury, and luxury card design.

### 1. Color System
- **Canvas / background:** deep obsidian with layered color:
  - Base `#0b0f1a` to `#0f1a17` vertical gradient
  - Radial aurora glows: emerald `rgba(16,185,129,0.10)` top-left, indigo `rgba(99,102,241,0.12)` top-right, subtle gold `rgba(212,175,55,0.05)` bottom
  - Subtle noise/grain texture overlay and faint dot grid
- **Surfaces / cards:** glassmorphism — translucent `rgba(255,255,255,0.04)` with `backdrop-filter: blur(20px)`, `1px solid rgba(255,255,255,0.08)` borders, inner top highlight.
- **Accent palette:**
  - Gold: `#d4af37`, `#e6c65a` (luxury accent, used sparingly for primary buttons / highlights)
  - Emerald: `#10b981`
  - Indigo: `#6366f1`
  - Text: `#f8fafc` primary, `#94a3b8` muted, `#64748b` subtle
- **Borders:** `rgba(255,255,255,0.08)` hairline, gold-tinted hover `rgba(212,175,55,0.35)`

### 2. Typography
- Headings / display: **"Playfair Display"** (serif) for the sheet's invoice header + hero — gives the luxury feel.
- UI: **"Plus Jakarta Sans"** 400–800.
- Numerals: **"JetBrains Mono"** tabular for all money.
- Eyebrow labels: 10px, uppercase, gold `#e6c65a`, `letter-spacing:0.12em`.

### 3. Depth & Material
- Shadows: `0 20px 60px -15px rgba(0,0,0,0.6)` ambient + colored glow under primary elements.
- Cards lift on hover (`translateY(-2px)` + stronger glow).
- Focus rings: gold `rgba(212,175,55,0.35)` glow.

### 4. The Invoice Paper (Hero)
- The sheet itself stays readable/printable: **ivory/cream paper** (`#faf7f0`) so it looks like expensive stationery — a deliberate contrast against the dark UI.
- Sheet header: company name in Playfair Display, thin gold rule divider.
- Totals block: deep obsidian card with gold total figure.
- Print output keeps cream paper + dark text for a premium PDF.

### 5. Micro-interactions
- Buttons: gradient gold (`linear-gradient(135deg,#d4af37,#e6c65a)`) with dark text on primary; hover lift + glow.
- Smooth 180ms ease transitions everywhere.
- Live preview pulse, status dots, glass inputs with inner glow on focus.

## Non-Negotiables
- Not plain white. Not default grey. Must read as "expensive".
- Print output must stay high-contrast and clean (cream paper, dark ink).
- Keep all functionality + accessibility (labels, focus-visible, keyboard).
