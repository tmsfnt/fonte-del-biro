# Fonte del Biro — sito scrollytelling

Next.js 14 (App Router) · TypeScript strict · Tailwind · Framer Motion · lucide-react.

## Avvio

```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy

```bash
npm i -g vercel
vercel
```

## Dove cambiare le cose

| Cosa | File |
| --- | --- |
| Palette (`granata`, `cream`, `canvas`, `beige`, `sky`) | `tailwind.config.ts` |
| Font (Cormorant Garamond + Inter) | `app/layout.tsx` + `tailwind.config.ts` |
| Link navbar | `components/Navbar.tsx` → `LINKS` |
| Testo hero, range animazione | `components/Hero.tsx` → `TITLE`, `TITLE_RANGE`, `LOGO_RANGE` |
| Frame hero | `public/frames/frame_000.jpg … frame_095.jpg` (aggiorna `FRAME_COUNT`) |
| Tenuta, stats, link Google Maps, card coming soon | `components/Locations.tsx` → `LOCATION`, `COMING` |
| Categorie, vini, prezzi, foto prodotto | `components/Catalogue.tsx` → `CATEGORIES` (campo `image` opzionale sovrascrive il gradient) |
| Email, telefono, indirizzo, Instagram | `components/Footer.tsx` → `CONTACT` |

## Asset placeholder da sostituire

- `public/images/vineyard.jpg`, `public/images/cellar.jpg` — sfondi card e catalogo (generati, sostituisci con foto vere)
- `public/images/bottle-cutout.png` — cutout PNG trasparente nella card Tenuta
- `public/images/logo-*.png` — logo ariete estratto dal video (granata / ink / white)

I frame dell'hero derivano dal video "Wine Stain Goat": 96 frame, 1600×900, con la carta
estesa ai lati per il cover-scaling su desktop.
