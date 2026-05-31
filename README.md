# Rydsta

Your ride stats, finally worth looking at. Turn your Uber, Ola, or Rapido trip history into a shareable visual story — stats, animated route map, rider personality, and heatmap — all in your browser, nothing uploaded.

---

## What it does

Drop a ride export and get a visual summary of your year:

- **Trip totals** — rides, total spend, busiest month
- **Rider archetype** — Night Owl, Airport Regular, or Road Warrior based on your patterns
- **Animated route map** — replay your trips city by city with MapLibre GL
- **Activity heatmap** — a full-year GitHub-style heatmap of your ride days
- **Deep stats** — distance, fare average, primary city, vehicle type
- **Shareable card** — download a PNG to post anywhere

## Supported exports

| Provider | Export type |
|---|---|
| **Uber** | Rider CSV export — `trips_data-0.csv` via Account → Privacy → Download my data |
| **Ola** | Booking history export via Account → Help → Data requests |
| **Rapido** | Ride history CSV via Profile → My Rides → Export |

## Privacy

Your trip data never leaves your device. Everything runs in the browser — the file you drop is parsed by a Web Worker and discarded when you close the tab. No account, no server, no upload.

---

## Development

Install dependencies:

```bash
pnpm install
```

Start the dev server at `http://localhost:3000`:

```bash
pnpm dev
```

Run unit tests:

```bash
pnpm test
```

Run end-to-end tests (requires a running dev server):

```bash
pnpm test:e2e
```

Build for production:

```bash
pnpm build
```

## Tech

- [Nuxt 3](https://nuxt.com) + Vue 3
- [MapLibre GL](https://maplibre.org) for route maps
- [OpenFreeMap](https://openfreemap.org) for map tiles
- [PapaParse](https://www.papaparse.com) for CSV parsing
- [SheetJS](https://sheetjs.com) for XLSX parsing
- [fflate](https://101arrowz.github.io/fflate/) for ZIP extraction
- Tailwind CSS + shadcn-vue

All file parsing runs in Web Workers. Trip data is held in memory only.

---

Built by [Akshara Hegde](https://akshara.dev)
