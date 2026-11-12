# Audit of the previous site

Reviewed 12 November 2026, before the files were replaced. The source of record is commit `bb00021` on `master` (`update webpage -- #Graduated`, pushed 12 May 2023). The published URL is [https://mziminski.github.io/](https://mziminski.github.io/).

## Method

- Read `index.html`, `css/styles.css`, `css/custom.css`, `js/scripts.js`, and the asset tree.
- Requested the live URL and the GitHub Pages API (`repos/mziminski/mziminski.github.io/pages` and `/pages/builds`).
- Checked every `http` and `https` URL in the HTML, and every local `src` / `href` against the working tree.
- Served the repository root locally and ran Lighthouse 12 (mobile, default throttling) against `http://127.0.0.1:4173/`. The live URL could not be measured because it does not serve the site. Local numbers therefore include uncompressed transfer of the CSS and HTML. GitHub Pages would compress text. It would not shrink the image bytes.

## The live URL is down

A request to `https://mziminski.github.io/` returns **HTTP 404** with GitHub’s “Site not found” page (observed 12 November 2026, with and without a browser user agent). `index.html` on that host returns the same 404.

The Pages API still says the site exists:

| Field | Value |
| --- | --- |
| `status` | `built` |
| `build_type` | `legacy` |
| Source | branch `master`, path `/` |
| `html_url` | `https://mziminski.github.io/` |
| `https_enforced` | true |
| `custom_404` | false |
| Latest build | 12 May 2023, commit `bb00021`, `error.message` null |

Search indexes still have a copy of the old page (title “UIC CS 424”), so the URL used to resolve. The API and the edge disagree now. Publishing from the branch root has not been refreshed since 2023, and there is no Actions workflow. The replacement site deploys with GitHub Actions. After merge, Pages has to be switched from “Deploy from a branch” to “GitHub Actions”, or the new build will not be what the URL serves.

## What the page is

One HTML document, about 720 lines, built on the Start Bootstrap Freelancer theme (the footer says so, and `js/scripts.js` carries the Freelancer v6.0.5 header). Bootstrap 4.5.3, jQuery 3.5.1, jQuery Easing, and Font Awesome 5.15.1 are loaded from public CDNs. None of those script tags has a `integrity` attribute. Google Fonts supplies Montserrat and Lato, also without `font-display` in the stylesheet URL.

The browser title is **UIC CS 424**. The visible H1 is “Matt Ziminski”, with the subhead “Recent BS/MS in CS Graduate from University of Illinois Chicago”. Three items sit under Portfolio, all from the course CS 424 (Data Visualization and Visual Analytics):

1. Project 1, an R/Shiny energy-production dashboard.
2. Project 2, an R/Leaflet power-plant map.
3. A critique of the UNICEF COVID-19 vaccine market dashboard.

The writing for each one is inside a Bootstrap modal, with carousels set to `data-ride="carousel"`. About is one paragraph. Contact is a mailto button for `mzimin2@uic.edu`, plus GitHub and LinkedIn icons. Copyright reads 2023.

There is no build, no package manifest, no CI, and a README whose entire body is `# mziminski.github.io`.

## Messaging and positioning

The page introduces a new graduate with interests in applied machine learning, data science, and some spatial research. It does not say what kind of engineer he is now, what he wants to be hired to do, or how the three projects relate to anything beyond the course.

The voice inside the modals is a lab report: objectives, “how to use”, data cleaning, and observations. That was appropriate as coursework. It is a weak portfolio. Typos are constant (“Intoduction”, “whith”, “thhis”, “relitivly”, “Floridia”, “narriated”, “GithHub”). Several headings are copied across unrelated screenshots, including `alt="Coal Insight histogram"` on vaccine-dashboard images. Icon-only buttons (GitHub, database, cloud, YouTube) have no visible or accessible name, so the “links” section of each project is a row of symbols.

The template shows through: a red masthead, star dividers, and a footer that credits Start Bootstrap. The title in the tab is the course, not the person. Nothing in the head describes him to a search result, a Slack unfurl, or a recruiter who never scrolls.

Positioning to replace: software engineering at the intersection of geospatial systems and AI systems engineering (systems around models: evaluation, observability, pipelines). The old page cannot carry that. It also should not be “fixed” by rewriting the course projects into that story. Those projects stay in their repositories. They are not the new showcase.

## Information hierarchy

What a reader can see without opening a modal:

1. Name and a graduation line.
2. Three screenshots with course-project titles.
3. One sentence that the screenshots are from CS 424.
4. A short about paragraph.
5. An email button and two social icons.

The actual work — and almost all of the words — is behind a plus-icon hover and a modal. There is no URL per project, so none of it can be shared or indexed as its own page. There is no writing section, no resume, and no way to tell coursework from the thing he wants to be known for.

Heading order is broken. Lighthouse flagged it. Project titles are `h5` directly under the page, the footer jumps to `h4`, and inside the second modal a heading is opened as `h5` and closed as `h3` (“Geothermal US Map”). The id `portfolioModal1Label` is repeated **15 times**, so the modal labels are not valid and any `aria-labelledby` pointing at that id is ambiguous.

## Project presentation

Each project is a screenshot, a modal, and a carousel of more screenshots. The images are full-resolution PNGs checked into git. The fifteen largest files are between about 0.9 MB and 2.0 MB. The working tree, excluding `.git`, is **44,775,836 bytes** across 61 files.

There is no architecture, no decision, and no stack beyond a paragraph listing R packages. Interesting observations are mixed with the assignment’s “how to use” instructions. The student-choice piece is a critique of someone else’s dashboard, which is a fair course assignment and a confusing portfolio centerpiece.

The home-page thumbnails for the three projects use `alt=""`. Several content images that do have alt text describe the wrong thing. Decorative template art is still in the repo and unused: `cabin.png`, `cake.png`, `circus.png`, `game.png`, `safe.png`, `submarine.png`, and `avataaars.svg`.

## Visual design

The look is the Freelancer theme: danger-red masthead (`#dc3545`), navy footer, Montserrat in all caps, Lato body, star icons as section rules. `css/custom.css` is 132 bytes (a round avatar and a 5px black image border). `css/styles.css` is the compiled theme at **187,369 bytes**, almost all of it unused Bootstrap.

There is no dark mode, no type scale beyond the theme’s utilities, and no layout that is specific to this person. On a small screen the Bootstrap navbar collapses, which is the theme working as designed, not a considered mobile reading layout. Modals of long prose and auto-advancing carousels are a poor phone experience, and the carousels do not account for `prefers-reduced-motion`.

## Performance

Lighthouse 12, mobile, local static server, one run:

| Category | Score |
| --- | --- |
| Performance | 60 |
| Accessibility | 88 |
| Best practices | 96 |
| SEO | 91 |

| Metric | Value |
| --- | --- |
| First Contentful Paint | 5.8 s |
| Largest Contentful Paint | 41.6 s |
| Speed Index | 5.8 s |
| Total Blocking Time | 50 ms |
| Cumulative Layout Shift | 0.018 |
| Time to Interactive | 43.3 s |
| Total byte weight | 43,030 KiB |

JavaScript is not the problem. The document is. Every carousel image is in the initial HTML, so the browser downloads the gallery even though it is inside a closed modal. Lighthouse’s savings estimates: about 17,382 KiB from modern image formats, 3,770 ms from render-blocking resources, 2,228 KiB from offscreen images. Render-blocking requests include Font Awesome’s `all.js` in the head, both Google Fonts stylesheets, and the unminified theme CSS. Images have no `width` or `height`. Font Awesome, jQuery, Bootstrap, and easing are extra round trips to third parties, and the two contact-form scripts 404 (see below), which Lighthouse recorded as console network errors.

Best practices at 96 is the least unhappy category. The console errors and the legacy JavaScript in Font Awesome and Bootstrap 4 are what keep it from being clean.

## Accessibility

Lighthouse’s failing audits, confirmed in the HTML:

- **Contrast.** Footer link `#dc3545` on `#2c3e50` measures **2.42:1**. The expected ratio for that text size is higher. The red-on-navy pairing is the theme, not an accident.
- **Link name.** The GitHub and LinkedIn controls are icons with no text, no `aria-label`, and nothing a screen reader can use. They are in tab order.
- **Name mismatch.** The menu button’s visible text is “Menu” and its `aria-label` is “Toggle navigation”.
- **Heading order.** See above.
- **Non-text name and empty alts.** Profile photo `alt=""`. Portfolio tiles `alt=""`. Copied, incorrect alts on later figures.
- **Duplicate ids.** `portfolioModal1Label` × 15.
- **Motion.** Carousels auto-ride. There is no reduced-motion handling in `js/scripts.js` or the theme.
- **Keyboard.** Carousel indicators are list items, not buttons. Social links and several project links are icon-only. There is no skip link.

`lang="en"` and a viewport meta are present. That is most of what the document gets right.

## SEO, meta, and social

| Need | State |
| --- | --- |
| Title | `UIC CS 424` |
| Meta description | `content=""` |
| Canonical | absent |
| Open Graph / Twitter | absent |
| `theme-color` | absent |
| JSON-LD | absent |
| Sitemap | absent |
| `robots.txt` | absent |
| RSS | absent |
| Custom 404 | Pages reports `custom_404: false` |
| Favicon | present (`assets/img/favicon.ico`), a theme asset |

The modal text is in the DOM, so a crawler can see it, but the snippet for the site would be an empty description under a course code. There is one URL for the whole portfolio.

## Links

Local references in the HTML: 57. External URLs: 20 unique. **Three local targets are missing:**

- `assets/img/sc/Products1.1.png` (the products carousel’s first slide; the file on disk is `Products.png`)
- `assets/mail/jqBootstrapValidation.js`
- `assets/mail/contact_me.js`

The mail scripts are the theme’s contact-form code. The page has no contact form. Both requests 404, and they are still in the document.

External checks on 12 November 2026:

| URL | Result |
| --- | --- |
| `http://startbootstrap.com` | 200 after redirect to HTTPS |
| GitHub profile and the two CS 424 repos | 200 |
| YouTube walkthroughs (3) | 200 on HEAD |
| UNICEF vaccine dashboard | 200 after redirect to a page titled as last updated January 2024 |
| EPA eGRID | 200 after redirect from `/egrid/download-data` to `/egrid/detailed-data` |
| Power BI report | 200 |
| Font and library CDNs | 200 |
| `https://www.eia.gov/electricity/data/state/` | **503** at audit time (may be transient; it is still a fragile dependency of the write-up) |
| Shiny apps for both class projects | HEAD 405, GET **202** |
| LinkedIn profile | 999 to a non-browser client (LinkedIn’s bot wall, not evidence the profile is gone) |
| `https://www.evl.uic.edu/people/2717` | **404** (a search snippet still describes an older EVL people page; it is not linked from the site, and it is not a live source) |

The Shiny URLs responding with 202 are not a dependable public demo. The UNICEF piece now points, via redirect, at an archived market page. The write-up still describes the dashboard as a current window on the vaccine rollout.

## Tech debt

- jQuery and Bootstrap 4.5.3 for a single scrolling page, including scrollspy and a shrink-on-scroll navbar.
- A 183 KB compiled stylesheet to paint three sections.
- About 40 MB of uncompressed PNGs in git history’s tip, with no image pipeline, no `srcset`, and no width or height.
- CDN scripts without Subresource Integrity, including a Font Awesome bundle in `<head>`.
- Dead contact-form scripts and dead template images.
- Invalid HTML: duplicate ids, a mismatched heading tag, empty required metadata.
- No formatting, no typecheck, no link check, no deploy workflow.
- Last content update is the May 2023 graduation edit. The copyright year and the “recent graduate” line are that moment, frozen.

## What the replacement should change

Kept, because it is already public on this site or on the GitHub profile the site links: the name, the UIC B.S./M.S. and the May 2023 date as an editable fact, the GitHub profile, the LinkedIn URL, and the published email as something to confirm. Earlier repositories can be linked as earlier work. They are not the showcase.

Not carried forward: the Freelancer theme, the course-project case studies, the screenshots, the Shiny embeds, the icon font, jQuery, the empty meta tags, and any invented employer, metric, or testimonial.

The new site is a static build with its own URLs, a real document head, an architecture per study, a lazy map demo, and a Pages workflow that does not depend on serving the repository root.
