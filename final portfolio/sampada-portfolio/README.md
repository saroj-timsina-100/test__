# Sampada Poudel – UI/UX Portfolio

A fast, static portfolio site: one home page, seven project pages, no frameworks and nothing to install.
Every page is plain HTML generated from a single content file, so it is easy to update and deploys anywhere.

> Why not Next.js? The portfolio is content-only (no accounts, forms or database), so a static site loads faster,
> costs nothing to host and has less to break. It also deploys to Vercel exactly the same way.

## What's in the folder

```
index.html, work/*/index.html   Generated pages (these are what gets deployed)
content/site.mjs                ✏️  ALL your text, projects, links and experience live here
build.mjs                       Regenerates the pages from content/site.mjs
assets/site.css, site.js        Styles and the small menu script
assets/covers/                  Mockup images for project cards (1600×1000, .webp + .jpg)
assets/img/<project>/           Your screens, optimised (.webp)
assets/Sampada-Poudel-CV.pdf    Your CV (the "Download CV" button)
assets/img/sampada.webp/.jpg    Your hero photo (metadata removed)
assets/logos/                   Company logos for the scrolling strip under the hero (see below)
tools/fetch-logos.mjs           Downloads the official company logos, then rebuilds
tools/make_assets.py            Rebuilds the mockup covers from your Figma exports
vercel.json                     Hosting settings
```

## Run it on your computer

You need [Node.js](https://nodejs.org) (version 18 or newer).

```bash
cd sampada-portfolio
npx serve . -l 3000       # then open http://localhost:3000
```

## Things to fill in before you publish

Open `content/site.mjs` and check the top of the file:

| Field | What to do |
|---|---|
| `siteUrl` | Your domain, e.g. `https://sampadapoudel.com`. Turns on social-share images, canonical links, sitemap and robots.txt. |
| `linkedin`, `instagram` | Already set (tracking text such as `?utm_source=...` removed from your links). Leave empty to hide. `youtube` is optional too. |
| `phone` | Empty by default so your number isn't public. Add it if you want it shown. |
| Experience dates | Black Tech ends "Oct" and XAV Technology ends "Aug" with no year, exactly as on your CV. Add the years. |

After any edit to `content/site.mjs`, run `node build.mjs` and commit/upload the changed files.

## Deploy to Vercel (free)

1. Put this folder on GitHub (create a repository and upload/push the files, including the generated `index.html` and `work/` folders).
2. Go to [vercel.com](https://vercel.com), sign in with GitHub and click **Add New → Project**, then pick the repository.
3. Framework Preset: **Other**. Leave Build Command and Output Directory **empty**. Click **Deploy**.
4. In a minute you'll have a `*.vercel.app` link. Every time you push to GitHub, the site updates by itself.

No GitHub? Install the Vercel CLI (`npm i -g vercel`), run `vercel` inside this folder and answer the prompts.

## Connect your own domain

1. Buy a domain from any registrar (Namecheap, GoDaddy, Porkbun, etc.).
2. In Vercel open your project → **Settings → Domains** → type your domain → **Add**.
3. Vercel shows the DNS records to create. At your registrar's DNS settings add:
   - For `yourname.com`: an **A** record, host `@`, value `76.76.21.21`
   - For `www.yourname.com`: a **CNAME** record, host `www`, value `cname.vercel-dns.com`
   (Vercel displays the exact values for your project; use those if they differ.)
4. Wait from a few minutes up to a few hours. Vercel issues the HTTPS certificate automatically.
5. Set `siteUrl` in `content/site.mjs` to your domain, run `node build.mjs`, and redeploy.

## Update things later

- **Change text, add or remove a project:** edit `content/site.mjs`, then `node build.mjs`.
- **Add a new project:** put its screens in `assets/img/<folder>/` (export from Figma as PNG, 2x, then convert to `.webp`),
  add a block to `projects` in `content/site.mjs`, and add a cover to `assets/covers/<slug>.webp` and `.jpg`.
  Use `kind: 'mobile'` for phone screens or `kind: 'web'` for websites and dashboards.
- **Replace your CV:** overwrite `assets/Sampada-Poudel-CV.pdf` with the new file, keeping the same name.
- **Re-make the mockup covers:** `pip install pillow`, then
  `python3 tools/make_assets.py path/to/projects` (a folder with one sub-folder of PNG exports per project).

## Company logo strip

The strip under the hero ("Experience & collaborations") scrolls slowly from right to left in a seamless CSS loop. It pauses on
hover or keyboard focus, and with "reduce motion" turned on it becomes a still, centred row. Speed is set by `--dur` in
`companyRow()` in `build.mjs`.

**Logo files could not be downloaded while building this (no internet in the build environment), so the strip currently shows
the company names as plain text.** To use the real logos, run this on your computer:

```bash
node tools/fetch-logos.mjs
```

It saves the official Black Tech and Everacy logos (from their own websites) into `assets/logos/` and rebuilds the pages.
For **XAV Technology** and **Urja Tech** no verified logo file could be found, so save each logo yourself as
`assets/logos/xav-technology.png` and `assets/logos/urja-tech.png` (transparent PNG or SVG) and run `node build.mjs`.
Until a file exists, that company shows as text, so nothing breaks. Tips:

- A logo that is white and disappears on the light background: add `invert: true` to that company in `content/site.mjs`.
- Logos show in muted grey and return to full colour on hover. Logos link to the websites you provided.
- Add or remove companies in the `companies` list in `content/site.mjs`.

## Design system

The look follows the [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) recommendations for a
personal portfolio: "Minimalism & Swiss Style", a neutral light background so the project mockups stand out, and subtle motion only.

- **Colours:** monochrome zinc with a single blue accent (focus rings and links). All tokens are at the top of `assets/site.css`.
- **Typography:** headings use **Space Grotesk**, body text uses **Archivo** (Google Fonts; see the `fonts` constant in
  `build.mjs` and the `--head` / `--sans` variables in `assets/site.css`).
- **Motion:** the hero headline fades in word by word and sections fade up gently as you scroll. Both are turned off when
  "reduce motion" is on, and everything stays visible if JavaScript is off.
- **Headline:** `headlineSoft` in `content/site.mjs` sets the part of the headline shown in grey. Remove it for a single-colour headline.

## Accessibility and performance

Semantic HTML, a skip link, visible keyboard focus, a keyboard-operable mobile menu, alt text on every image,
reduced-motion support, responsive layouts, lazy-loaded WebP images with width and height set, and page-level
titles, descriptions and Open Graph tags.

## Notes

- Project descriptions only describe what is visible in your screens. No research, results or client names were invented.
  If you want full case studies, add your real process (problem, research, decisions, outcome) as extra paragraphs in each
  project's `description` list in `content/site.mjs`.
- Fonts load from Google Fonts; the site falls back to Georgia and system fonts offline.
