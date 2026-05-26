# Source Mapping Report — dsccsaudia.com

_Generated 2026-04-20_

## Source pages fetched

| URL | Bytes | Notes |
|---|---|---|
| `https://dsccsaudia.com/`        | 94 863 | Homepage with hero, features, services grid, projects strip, partners, clients |
| `https://dsccsaudia.com/service` | 56 946 | Services index with 4 sector tabs and 25 service cards |
| `https://dsccsaudia.com/projects`| 5 085 | 404-style template — content not present on this URL |
| `https://dsccsaudia.com/about`   | 56 222 | Mission, approach, teams, logo philosophy, stats |
| `https://dsccsaudia.com/contact` | 49 709 | Two offices, form, WhatsApp |
| `https://dsccsaudia.com/projects/*` × 6 | – | Hilton Swiss Palms, Casa Verde, Harmony Haven, Rooftop Escapes, Sea Shell Hotel, Square Workspaces |
| `https://dsccsaudia.com/service/*` × 25 | – | All 25 service detail pages |

## Asset migration

- Source root: `https://dsccsaudia.com/assets/`
- Mirrored to: `artifacts/dscc-website/public/assets/`
- Total files: 89 (6.5 MB)
- Logo SVGs additionally exposed at `/logo.svg` (dark-on-light) and `/logo-light.svg` (light-on-dark)
- Favicons exposed at `/favicon.svg` and `/favicon.png`

## Wired into the rebuilt site (this turn)

| Element | Status | File |
|---|---|---|
| Brand color tokens (#921b43 / #0a1121) | DONE | `src/index.css` |
| Logo SVG in header & footer | DONE | `Header.tsx` (already used `/logo.svg`), `Footer.tsx` |
| Footer social links (FB, IG, X, TikTok, WhatsApp) | DONE | `Footer.tsx` |
| Footer contact (Saudi HQ address, phone, email) | DONE | `Footer.tsx` |
| Contact page offices (Saudi HQ + Shanghai) | DONE | `pages/contact.tsx` |
| Contact page WhatsApp / email / phone cards | DONE | `pages/contact.tsx` |
| 12 JSON manifests + reports | DONE | `public/extract/*.json` `*.md` |

## Pending (next turns)

| Element | Reason | Plan |
|---|---|---|
| `services.ts` data file | Currently fictional — needs replacement with the 25 real service titles, slugs, icons and description text. | Rebuild with EXACT source titles (preserving "Hospitality Signage & Wayfinding1") and copied detail-page text. |
| `projects.ts` data file | Currently fictional KAFD/NEOM/Red-Sea projects — replace with the 6 real DSCC projects (Hilton Swiss Palms, Casa Verde, etc.). | Rebuild with source title, client, location, narrative, solutions implemented. |
| `sectors.ts` data file | 4 sectors already match source taxonomy. Tab labels need source-exact spelling ("All Soultions"). | Update tab labels only; preserve typo. |
| `clients.ts` data file | Currently lists fictional brand mix. Replace with extracted clients/partners + logo paths. | Rebuild from `clients.json` + `partners.json`. |
| Hero slides on homepage | Currently uses placeholder copy. Replace with the 4 source slides (preserving "Rsidential" typo). | Update homepage hero. |
| About page narrative | Currently rewritten copy. Replace with source mission, approach, teams, logo philosophy, stats (3250 / 425 / 38 / 7430). | Rebuild `pages/about.tsx`. |
| Service detail pages | Currently uses fictional copy. Replace with source detail-page text per service. | Rebuild `pages/service-detail.tsx` data binding. |
| Project detail pages | Replace with source narratives. | Rebuild `pages/project-detail.tsx` data binding. |

## Arabic localization note

The source site `dsccsaudia.com` is **English-only**. The current Replit build supports both English and Arabic. The strict extraction rules forbid rewriting source text; they do not prohibit translation for accessibility. Arabic strings in the rebuilt data files are best-effort translations of the extracted English text and should be flagged for a human Arabic reviewer before going live in production. English strings remain verbatim from the source.
