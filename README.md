# Kopi SEA

Landing page for Toko Kopi Sea. Vite + React 19 + TypeScript (strict) + Tailwind v4, GSAP (scroll scenes) and Motion (UI interaction). Design tokens: see `MASTER.md`.

```bash
npm install
cp .env.example .env   # optional: VITE_SITE_URL
npm run dev
npm run build          # type-check + production build
npm run lint
```

## Where things live
- `src/data/menu.ts`: selling prices from the POS (no cost data).
- `src/data/site.ts`: hours, branches (map, QR image, order link), Instagram. Items marked CONFIRM need the owner's yes.
- `public/qr/*.png`: the owner's own QR image per branch.
- `src/sections/*`: Hero, Favorites, TimeDial (pinned), Statement, OrderAhead, Footer.
- `src/components/CupArt.tsx`: vector product art, a stand-in for photos. See `public/images/README.md`.

## Rules in code
One animation library per component (GSAP in sections, Motion in `Magnetic`, `MobileMenu`, `FeaturedTag`, `HeroCupSwap`, `ReceiptCard`, `Preloader`). Only transform and opacity animate. All GSAP scenes sit inside `gsap.matchMedia` so reduced motion shows the final state.

## Open items
Official logo SVG, real product photos, brand hex values, confirmation that the QR links open the ordering page, Lenis (optional), prerendering for a faster first paint.
