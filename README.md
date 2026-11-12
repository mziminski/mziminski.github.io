# Matt Ziminski

Personal site. Static [Astro](https://astro.build/) build for GitHub Pages at [mziminski.github.io](https://mziminski.github.io/).

Geospatial systems, software engineering, and AI systems engineering. AI systems engineering here means the systems around a model: evaluation, observability, and the pipelines that feed it.

The studies under `src/content/work/` are portfolio designs. They are not a claim about an employer, a client, or a measured result. Empty fields render as **edit me** on the page.

## Edit me

Do these before treating the site as final. Each one is also marked `TODO(matt)` in the source.

| What | Where |
| --- | --- |
| Email. The value is the address the previous site published (`mzimin2@uic.edu`). Replace it if that inbox is wrong. | `src/data/site.ts` → `email` |
| LinkedIn URL. Confirm the profile path. | `src/data/site.ts` → `linkedin` |
| Location. Leave `""` to keep the about-page chip, or set a place you want shown. | `src/data/site.ts` → `location` |
| Education wording. Carried from the previous site (UIC, B.S. and M.S., 6 May 2023). | `src/data/site.ts` → `education` |
| Credentials worth listing. The about page has an empty chip and does not invent any. | `src/pages/about.astro` |
| Resume. There is no PDF. Add one at `public/resume.pdf` and the resume page links it on the next build. | `public/resume.pdf` |
| Per study: role, timeframe, repository. Blank fields show an edit chip. Do not fill these with guesses. | Front matter in `src/content/work/*.mdx` |
| Study copy, if a design should be replaced by work you actually shipped. | The same MDX files |
| Sample map geometry, if you want a real dataset you have the rights to show. Keep the “not for travel” line if the data can be mistaken for current conditions. | `src/data/explorer.ts` |
| The two notes. Both are drafts, `noindex`, and dated with this rebuild (12 November 2026). Edit them or delete them. | `src/content/notes/*.md` |
| Earlier-repository blurbs, if any description should be shorter or removed. | `src/data/site.ts` → `earlierWork` |
| A portrait. This version uses a monogram, not the old photo. | Header / `public/favicon.svg` if you change the mark |

Do not add employers, clients, dates, metrics, awards, or testimonials unless they are yours.

## Develop

Node 22.19 or newer.

```bash
npm install
npm run dev
```

`npm run build` writes Open Graph images and icons, then the static site, into `dist/`. `npm run preview` serves that folder.

Other checks:

```bash
npm run check
node scripts/check-contrast.mjs
npm run check:links
npm run serve
npm run check:a11y
npm run check:lighthouse
npm run screenshots
```

Accessibility and Lighthouse expect Chrome (`CHROME_PATH` if it is not `/usr/local/bin/google-chrome`) and the static server from `npm run serve`. Lighthouse fails the run under 95 in performance, accessibility, best practices, and SEO.

## Deploy

`.github/workflows/deploy.yml` builds on a push to `master` and deploys with GitHub Actions. `.github/workflows/ci.yml` typechecks, checks contrast and links, and runs axe and Lighthouse on pull requests.

This repository is a user site (`mziminski.github.io`), so the Astro `site` is `https://mziminski.github.io` and `base` is `/`. Project sites would need a different base. This one does not.

### Switch Pages to GitHub Actions

The previous site was published as **Deploy from a branch** (`master` / `/`). The Actions workflow does not replace that setting by itself. After this lands on `master`:

1. Open the repository **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Leave the branch-based source unset. If it stays on `master` `/`, GitHub will serve the Astro source instead of `dist/`.
4. Confirm the **Deploy to GitHub Pages** workflow ran on the merge commit. Re-run it from the Actions tab if the source was switched after the push. `workflow_dispatch` is enabled.

Do not force-push, and do not push this work straight to `master`. Merge the pull request.

## Stack

Astro 7, TypeScript, MDX for the studies, `@astrojs/sitemap`, `@astrojs/rss`. MapLibre GL and OpenFreeMap load only after the home-page button is used. No API keys and no form that collects data. Fonts are self-hosted (Source Serif 4, Source Sans 3, IBM Plex Mono, Latin).

## Map credit

The basemap is © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, via [OpenFreeMap](https://openfreemap.org/). The trails and plumes are sample geometry in `src/data/explorer.ts`.
