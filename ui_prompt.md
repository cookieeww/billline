# Luxury & Ultra-Modern UI Design System Specification — Billline

## Vision & aesthetic goal
Redesign Billline from a standard utility tool into a high-end, luxury fintech SaaS experience matching the refined visual polish of Stripe, Vercel, Linear, and Raycast.

## Core Design Principles

1. **Typography & Hierarchy:**
   - Primary typeface: Inter / Plus Jakarta Sans (Google Fonts) with optimal line-heights and tight tracking on headings (`letter-spacing: -0.02em`).
   - Monospace & Numbers: `tabular-nums` for crisp alignment on prices, amounts, and dates.
   - Distinct scale: Large bold section titles, subtle uppercase eyebrow labels (`font-size: 11px`, `letter-spacing: 0.08em`, soft muted color).

2. **Color System (Luxury Light Mode + Glass Elements):**
   - Background: Soft warm porcelain / neutral canvas (`#f8fafc` / `#f1f5f9` with subtle multi-layer radial gradient backdrop).
   - Surfaces: Pure white elevated cards (`#ffffff`) with hairline borders (`1px solid rgba(226, 232, 240, 0.8)`).
   - Brand Accent: Deep obsidian slate (`#0f172a`) paired with refined emerald or indigo micro-accents (`#059669` / `#6366f1` / `#10b981`).
   - Shadows: Multi-tiered ambient drop shadows (`box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)`).

3. **Interactive Components:**
   - Buttons: Solid dark action buttons with subtle inner highlight, smooth 150ms transitions, subtle scale effect on hover/active.
   - Inputs: Rounded (10px) inputs with soft inner padding, subtle background tint on idle (`#f8fafc`), expanding focus ring with glow (`box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15)`).
   - Logo Upload: Drag-and-drop target with subtle dashed border, hover glow, and instant preview card.
   - Item Rows: Floating row inputs with integrated remove action and smooth hover state.

4. **Invoice Preview Sheet (The Hero Canvas):**
   - Paper Canvas: Elevated A4 card floating over a subtle grid/dot pattern backdrop.
   - Sheet Styling: Crisp header with accent stripe / minimalist company typography, table headers with dark underline, clear line item rows, dark total highlight box for high impact.
   - Print Fidelity: Clean 1-page A4 CSS print styles preserving exact alignment and high contrast.

5. **Micro-Details:**
   - Smooth transition animations on hover and input focus.
   - Custom styled select inputs, custom file upload button.
   - Mobile responsive drawer/switch for editor and live preview.
