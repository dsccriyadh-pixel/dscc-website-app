# Missing Assets Report — dsccsaudia.com extraction

_Generated 2026-04-20_

## Status: 89 / 89 referenced assets downloaded successfully.

All asset URLs discovered in the homepage, services page, services index, projects detail pages, about page and contact page were downloaded into `public/assets/` preserving the original directory structure.

## Items reported as missing on the source (NOT replaced)

| Item | Status | Reason |
|---|---|---|
| `/projects` index page content | Source returned a 404-style template (~5 KB) instead of a project listing. Project links are present in the homepage and footer; project detail pages were fetched directly. | Recorded; not replaced. |
| Service detail page extra image — second-card photo for some services | A few service pages reference the same upload twice or only have one cover image. | Recorded; no fabrication. |
| LinkedIn / YouTube social profiles | Not present in source HTML. | Not added. |
| Project gallery images for 5 of 6 projects | Source detail pages mostly show stock-style placeholders (`approch1694255507.jpg`, `special-equipment21694202183.jpg`) rather than per-project photography. | Preserved as-is; no fabrication. |
| 5 client logos (`clients/01.svg` … `05.svg`) | Source displays without visible brand names. | Preserved with `name: null`. |
| Project narratives in non-Hilton projects | Detail pages contain only short summary plus standard CTA — no rich per-project text. | Preserved as-is; no fabrication. |
