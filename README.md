Jay’s Frames — POS (Supabase + Pricing Engine)

What this is
- A mobile‑first POS that imports your **pricing.js** engine and calculates totals live.
- Saves customer + job + line items to Supabase.

Setup (5 minutes)
1) In Supabase → SQL Editor: run `schema.sql`.
2) Open `supabase-config.js` and paste your project URL + anon key.
3) Serve the folder locally (or open `index.html` directly). Sign‑in is optional in this minimal build; add auth later if you want.

How to use
- Fill customer + dims. Add moulding rows with **wholesale PPFT**.
- Pick glazing basis and rate (or extend to read from your glazing tables).
- Specials = extra labor/services (shadowbox, float, etc.).
- Totals update every keypress via `pricing.js:jobTotals()`.

Where to plug your catalogs next
- Hook Larson/Roma lookup to auto‑fill PPFT.
- Replace manual glazing inputs with a drop‑down bound to your **glazing tables** (per‑sq.in + UI bands).
- Keep `bands.json` updated if your markup ladder shifts (e.g., 4.5×→1.9× endpoints).

Built 2025-08-13 03:33.
