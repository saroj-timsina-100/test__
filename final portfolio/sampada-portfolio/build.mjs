// Static site generator: reads content/site.mjs and writes index.html + work/<slug>/index.html
// Run with:  node build.mjs     (no dependencies needed)
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { site, about, skills, experience, education, projects, companies } from './content/site.mjs';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p) => (site.siteUrl ? site.siteUrl.replace(/\/$/, '') + p : p);
const mail = `mailto:${site.email}`;
// vercel.json caches /assets/ for a year, so CSS/JS links carry a content hash to load fresh files after each change.
const ver = (file) => createHash('md5').update(readFileSync(file)).digest('hex').slice(0, 8);
const cssHref = `/assets/site.css?v=${ver('assets/site.css')}`;
const jsHref = `/assets/site.js?v=${ver('assets/site.js')}`;

const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap">`;

// Runs in <head> before the page paints, so a saved dark theme never flashes light on refresh.
// Saved choice wins; with nothing saved, the visitor's system setting is used.
const themeInit = `(function(){var d=document.documentElement,t;d.classList.add('js');try{t=localStorage.getItem('theme')}catch(e){}
if(t!=='light'&&t!=='dark'){t=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}
d.setAttribute('data-theme',t)})()`;

function head({ title, desc, path, image }) {
  const url = site.siteUrl ? abs(path) : '';
  const img = site.siteUrl ? abs(image) : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#fafafa">
${url ? `<link rel="canonical" href="${url}">` : ''}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
${url ? `<meta property="og:url" content="${url}">` : ''}
${img ? `<meta property="og:image" content="${img}">` : ''}
<meta name="twitter:card" content="${img ? 'summary_large_image' : 'summary'}">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
${img ? `<meta name="twitter:image" content="${img}">` : ''}
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2318181b'/%3E%3Ctext x='32' y='42' font-family='Helvetica,Arial,sans-serif' font-weight='700' font-size='26' text-anchor='middle' fill='%23fafafa'%3ESP%3C/text%3E%3C/svg%3E">
${fonts}
<link rel="stylesheet" href="${cssHref}">
<script>${themeInit}</script>
</head>`;
}

const header = (home) => `<a class="skip" href="#main">Skip to content</a>
<header class="nav" id="top">
  <div class="wrap nav-in">
    <a class="logo" href="/" aria-label="${esc(site.name)}, home">${esc(site.name)}</a>
    <div class="nav-end">
      <nav class="nav-links" id="menu" aria-label="Main">
        <a href="${home ? '' : '/'}#work">Projects</a>
        <a href="${home ? '' : '/'}#about">About</a>
        <a href="${home ? '' : '/'}#experience">Experience</a>
        <a href="${home ? '' : '/'}#contact">Contact</a>
        <a class="btn btn-small nav-cta" href="${mail}">Let’s talk</a>
      </nav>
      <button class="theme-toggle" type="button" aria-label="Dark mode" aria-pressed="false">${moon}${sun}</button>
      <button class="menu-btn" aria-expanded="false" aria-controls="menu" aria-label="Menu"><span></span><span></span></button>
    </div>
  </div>
</header>`;

const svg = (paths, size = 20) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
const icons = {
  LinkedIn: svg('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>'),
  Instagram: svg('<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>'),
  Email: svg('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
  YouTube: svg('<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>'),
};
const arrowRight = svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', 18);
const arrowLeft = svg('<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>', 18);
const arrowUpRight = svg('<path d="M7 17 17 7"/><path d="M7 7h10v10"/>', 18);
const moon = svg('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>', 18).replace('<svg', '<svg class="icon-moon"');
const sun = svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>', 18).replace('<svg', '<svg class="icon-sun"');
const download = svg('<path d="M12 15V3"/><path d="m7 10 5 5 5-5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>', 18);

const socials = () => [
  site.linkedin && ['LinkedIn', site.linkedin],
  site.instagram && ['Instagram', site.instagram],
  site.youtube && ['YouTube', site.youtube],
].filter(Boolean);

const footer = () => `<footer class="foot" id="contact">
  <div class="wrap">
    <div class="cta-panel reveal">
      <h2>Have a product to design? Let’s talk.</h2>
      <p>The quickest way to reach me is email.</p>
      <div class="cta-row">
        <a class="btn btn-light" href="${mail}">${icons.Email}${esc(site.email)}</a>
        <a class="btn btn-outline-light" href="${site.cv}" download>${download}Download CV</a>
      </div>
    </div>
    <div class="foot-grid">
      <div><p class="foot-name">${esc(site.name)}</p><p class="muted">${esc(site.title)}<br>${esc(site.location)}</p></div>
      <ul class="foot-links" aria-label="Elsewhere">
        <li><a class="social" href="${mail}">${icons.Email}<span>Email</span></a></li>
        ${site.phone ? `<li><a href="tel:${esc(site.phone.replace(/[^+\d]/g, ''))}">${esc(site.phone)}</a></li>` : ''}
        ${socials().map(([n, u]) => `<li><a class="social" href="${esc(u)}" rel="noopener noreferrer" target="_blank" aria-label="${n} (opens in a new tab)">${icons[n]}<span>${n}</span></a></li>`).join('')}
      </ul>
    </div>
    <p class="fine">© ${new Date().getFullYear()} ${esc(site.name)}</p>
  </div>
</footer>
<script src="${jsHref}" defer></script>`;

const pic = (src, alt, w, h, { eager = false, cls = '' } = {}) => {
  const jpg = src.replace(/\.webp$/, '.jpg');
  return `<picture><source srcset="${src}" type="image/webp"><img${cls ? ` class="${cls}"` : ''} src="${jpg}" alt="${esc(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}></picture>`;
};

const sectionHead = (id, title, sub = '') => `<div class="section-head center reveal"><h2 id="${id}">${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ''}</div>`;

// ---------- Hero ----------
// Each word is wrapped so it can fade in one after another (CSS only; skipped with reduced motion).
function headline() {
  const words = (text, start) => text.trim().split(/\s+/).map((w, i) => `<span class="w" style="--i:${start + i}">${esc(w)}</span>`);
  const soft = site.headlineSoft && site.headline.endsWith(site.headlineSoft) ? site.headlineSoft : '';
  const main = words(site.headline.slice(0, site.headline.length - soft.length), 0);
  const tail = soft ? words(soft, main.length) : [];
  return `${main.join(' ')}${tail.length ? ` <span class="soft">${tail.join(' ')}</span>` : ''}`;
}
const intro = () => esc(site.intro).replace(esc(site.name), `<strong>${esc(site.name)}</strong>`);

// ---------- Company marquee ----------
// Each track repeats the set so it is wider than the container; the second track is a copy for the seamless loop.
// Only the first set is exposed to screen readers and keyboard; copies are hidden and removed under reduced motion.
function companyRow() {
  if (!companies.length) return '';
  const REPEATS = 3;
  const item = (c, copy) => {
    const hasLogo = c.logo && existsSync(`assets/logos/${c.logo}`);
    const inner = hasLogo
      ? `<img class="logo-img" src="/assets/logos/${esc(c.logo)}" alt="${copy ? '' : `${esc(c.name)} logo`}" height="32" loading="lazy" decoding="async" data-name="${esc(c.name)}">`
      : `<span class="logo-text">${esc(c.name)}</span>`;
    const link = c.url
      ? `<a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer"${copy ? ' tabindex="-1"' : ` aria-label="${esc(c.name)} (opens in a new tab)"`}>${inner}</a>`
      : inner;
    return `<li class="logo-item${c.invert ? ' invert' : ''}${copy ? ' copy' : ''}"${copy ? ' aria-hidden="true"' : ''}>${link}</li>`;
  };
  const track = (hidden) => `<ul class="marquee-track"${hidden ? ' aria-hidden="true"' : ''}>${Array.from({ length: REPEATS }, (_, r) => companies.map((c) => item(c, hidden || r > 0)).join('')).join('')}</ul>`;
  return `<section class="logos" aria-labelledby="logos-h">
  <div class="wrap logos-in">
    <h2 id="logos-h" class="label">Experience &amp; collaborations</h2>
    <div class="marquee" style="--dur:${companies.length * REPEATS * 4}s">${track(false)}${track(true)}</div>
  </div>
</section>`;
}

// ---------- Home ----------
function card(p, i) {
  return `<a class="card reveal${i === 0 ? ' card-feature' : ''}" href="/work/${p.slug}/">
  <div class="card-media">${pic(`/assets/covers/${p.slug}.webp`, `${p.title} interface mockups`, 1600, 1000)}</div>
  <div class="card-body">
    <p class="card-meta">${esc(p.type)}</p>
    <div class="card-title"><h3>${esc(p.title)}</h3><span class="card-arrow">${arrowUpRight}</span></div>
    <p>${esc(p.summary)}</p>
  </div>
</a>`;
}

const timeline = (rows) => `<ol class="timeline">${rows.map((r) => `<li class="reveal">
  <div class="tl-row"><p class="what">${esc(r.title)}</p>${r.ongoing ? '<p class="when ongoing">Ongoing</p>' : `<p class="when">${esc(r.dates)}</p>`}</div>
  <p class="muted">${esc(r.sub)}</p>
</li>`).join('')}</ol>`;

function home() {
  return `${head({ title: `${site.name} | ${site.title}`, desc: site.description, path: '/', image: `/assets/covers/${projects[0].slug}.jpg` })}
<body>
${header(true)}
<main id="main">
<section class="hero">
  <div class="wrap hero-in">
    <p class="badge">${esc(site.eyebrow)}</p>
    <h1 class="headline">${headline()}</h1>
    <p class="lead">${intro()}</p>
    <div class="cta-row">
      <a class="btn" href="#work">Explore my work${arrowRight}</a>
      <a class="btn btn-ghost" href="${site.cv}" download>${download}Download CV</a>
    </div>
  </div>
</section>

${companyRow()}

<section class="section" id="work" aria-labelledby="work-h">
  <div class="wrap">
    ${sectionHead('work-h', 'Selected work', `${projects.length} projects across mobile apps, websites and dashboards.`)}
    <div class="grid">${projects.map(card).join('\n')}</div>
  </div>
</section>

<section class="section" id="about" aria-labelledby="about-h">
  <div class="wrap">
    ${sectionHead('about-h', 'About me')}
    <div class="about reveal">
      <figure class="avatar">${pic(site.photo, site.photoAlt, 461, 784)}</figure>
      <div class="prose">${about.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
    </div>
  </div>
</section>

<section class="section" id="skills" aria-labelledby="skills-h">
  <div class="wrap">
    ${sectionHead('skills-h', 'Skills & tools')}
    <div class="skills">${skills.map((g) => `<div class="skill reveal"><h3 class="label">${esc(g.group)}</h3><ul class="chips">${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}</div>
  </div>
</section>

<section class="section" id="experience" aria-labelledby="exp-h">
  <div class="wrap">
    ${sectionHead('exp-h', 'Experience')}
    <div class="tl-wrap">
      ${timeline(experience.map((e) => ({ title: e.role, dates: e.dates, ongoing: e.ongoing, sub: `${e.org}${e.type ? ' · ' + e.type : ''}` })))}
      <h3 class="label sub">Education</h3>
      ${timeline(education.map((e) => ({ title: e.what, dates: e.dates, sub: e.where })))}
    </div>
  </div>
</section>
</main>
${footer()}
</body></html>`;
}

// ---------- Project pages ----------
function shots(p) {
  const dir = `/assets/img/${p.folder}/`;
  if (p.kind === 'mobile') {
    return `<ul class="phones">${p.shots.map(([f, cap]) => `<li class="reveal"><figure><div class="phone">${pic(dir + f, `${p.title}: ${cap}`, 390, 844)}</div><figcaption>${esc(cap)}</figcaption></figure></li>`).join('')}</ul>`;
  }
  return `<div class="browsers">${p.shots.map(([f, cap, o = {}]) => `<figure class="reveal ${o.tall ? 'browser-tall' : 'browser-wide'}">
  <div class="browser"><div class="browser-bar" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="browser-view" ${o.tall ? 'tabindex="0" role="region" aria-label="' + esc(p.title + ': ' + cap) + '"' : ''}>${pic(dir + f, `${p.title}: ${cap}`, 1440, 900)}</div></div>
  <figcaption>${esc(cap)}</figcaption></figure>`).join('')}</div>`;
}

function projectPage(p, i) {
  const prev = projects[(i + projects.length - 1) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return `${head({ title: `${p.title} | ${site.name}`, desc: p.summary, path: `/work/${p.slug}/`, image: `/assets/covers/${p.slug}.jpg` })}
<body>
${header(false)}
<main id="main">
<section class="p-hero">
  <div class="wrap">
    <a class="back" href="/#work">${arrowLeft}All projects</a>
    <h1>${esc(p.title)}</h1>
    <p class="lead">${esc(p.summary)}</p>
    <dl class="facts">
      <div><dt>Type</dt><dd>${esc(p.type)}</dd></div>
      <div><dt>Platform</dt><dd>${esc(p.platform)}</dd></div>
      <div><dt>Discipline</dt><dd>UI/UX design</dd></div>
      <div><dt>Screens shown</dt><dd>${p.shots.length}</dd></div>
    </dl>
  </div>
</section>
<div class="wrap cover">${pic(`/assets/covers/${p.slug}.webp`, `${p.title} interface mockups`, 1600, 1000, { eager: true })}</div>
<section class="section">
  <div class="wrap split">
    <h2>Overview</h2>
    <div class="prose">${p.description.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
  </div>
</section>
<section class="section" aria-labelledby="screens-h">
  <div class="wrap">
    <div class="section-head"><h2 id="screens-h">Screens</h2></div>
    ${shots(p)}
  </div>
</section>
<section class="section section-tight">
  <div class="wrap pn">
    <a href="/work/${prev.slug}/"><span class="muted">${arrowLeft}Previous</span><strong>${esc(prev.title)}</strong></a>
    <a href="/work/${next.slug}/" class="pn-next"><span class="muted">Next${arrowRight}</span><strong>${esc(next.title)}</strong></a>
  </div>
</section>
</main>
${footer()}
</body></html>`;
}

writeFileSync('index.html', home());
projects.forEach((p, i) => {
  mkdirSync(`work/${p.slug}`, { recursive: true });
  writeFileSync(`work/${p.slug}/index.html`, projectPage(p, i));
});
writeFileSync('404.html', `${head({ title: `Page not found | ${site.name}`, desc: 'This page does not exist.', path: '/404.html', image: '' })}
<body>${header(false)}<main id="main" class="wrap nf"><h1>That page doesn’t exist.</h1><p class="lead">Try the <a href="/">home page</a> or the <a href="/#work">projects</a>.</p></main>${footer()}</body></html>`);
if (site.siteUrl) {
  const urls = ['/', ...projects.map((p) => `/work/${p.slug}/`)].map((u) => `<url><loc>${abs(u)}</loc></url>`).join('');
  writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  writeFileSync('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${abs('/sitemap.xml')}\n`);
}
console.log(`Built ${projects.length + 2} pages.`);
