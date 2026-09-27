/* FreeToolHub static site generator.
   Run: node _build/build.js  (from ~/workspace/freetoolhub)
   Reads _build/data-*.js and emits index.html, tools/*.html, sitemap.xml, robots.txt */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://freetoolhubhq.github.io/freetoolhub/';   // <-- update to the real GitHub Pages URL after repo creation
const TODAY = '2026-09-27';

const dataFiles = ['data-finance.js', 'data-everyday1.js', 'data-everyday2.js'];
let tools = [];
for (const f of dataFiles) {
  tools = tools.concat(require(path.join(__dirname, f)));
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const ICONS = {
  'emi-calculator': '🏦', 'gst-calculator': '🧾', 'fd-calculator': '💰',
  'rd-calculator': '📈', 'sip-calculator': '📊', 'income-tax-calculator': '🧮',
  'percentage-calculator': '％', 'compound-interest-calculator': '💹',
  'age-calculator': '🎂', 'bmi-calculator': '⚖️', 'qr-code-generator': '🔳',
  'password-generator': '🔐', 'word-counter': '🔤', 'case-converter': '🔠',
  'json-formatter-validator': '🧩', 'color-converter': '🎨',
  'unit-converter': '📏', 'uuid-generator': '🆔', 'date-difference-calculator': '📅',
  'random-number-generator': '🎲', 'stopwatch-timer': '⏱️', 'text-to-speech': '🔊'
};

const CAT_DESC = {
  'Finance': 'Calculators for loans, taxes, GST, fixed deposits and investments — built for India.',
  'Everyday': 'Handy day-to-day tools: converters, generators, counters and utilities.'
};

const FOOTER = `<footer class="site-footer"><div class="wrap">
<div><strong style="color:#fff">FreeToolHub</strong> — Free Online Tools for Everyday India.</div>
<div><a href="index.html">Home</a> &nbsp;·&nbsp; <a href="index.html#finance">Finance tools</a> &nbsp;·&nbsp; <a href="index.html#everyday">Everyday tools</a></div>
</div><p class="disclaimer">Calculations are estimates for general information only and are not financial, tax or medical advice. Tax rules change with each Budget — verify current provisions on incometax.gov.in for your own situation.</p></footer>`;

function toolCard(t, prefix) {
  return `<a class="card" href="${prefix}${t.slug}.html" data-name="${esc((t.h1 + ' ' + t.cardDesc + ' ' + t.category).toLowerCase())}">`
    + `<div class="ticon">${ICONS[t.slug] || '🔧'}</div>`
    + `<h3>${esc(t.h1)}</h3><p>${esc(t.cardDesc)}</p><span class="go">Use tool →</span></a>`;
}

function toolPage(t) {
  const related = tools.filter(x => x.category === t.category && x.slug !== t.slug).slice(0, 4);
  const introHtml = t.intro.map(p => `<p>${esc(p)}</p>`).join('\n');
  const faqHtml = t.faq.map(([q, a]) =>
    `<details><summary>${esc(q)}</summary><div class="a">${esc(a)}</div></details>`).join('\n');
  const relatedHtml = related.map(r => toolCard(r, '')).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.meta)}">
<link rel="stylesheet" href="../assets/style.css">
${t.extraHead || ''}
</head>
<body>
<header class="site-header"><div class="wrap">
<a class="logo" href="../index.html">Free<span>Tool</span>Hub</a>
<nav class="nav"><a href="../index.html">Home</a><a href="../index.html#finance">Finance</a><a href="../index.html#everyday">Everyday</a></nav>
</div></header>
<main class="wrap">
<nav class="crumb"><a href="../index.html">Home</a> / ${esc(t.category)} / ${esc(t.h1)}</nav>
<div class="tool-head"><h1>${esc(t.h1)}</h1><p class="lead">${esc(t.cardDesc)}</p></div>
<!-- ADSENSE: paste ad unit here -->
<div class="toolbox">
${t.formHtml}
</div>
<!-- ADSENSE: paste ad unit here -->
<section class="prose">
<h2>About this tool</h2>
${introHtml}
<h2>Frequently asked questions</h2>
<div class="faq">
${faqHtml}
</div>
</section>
<!-- ADSENSE: paste ad unit here -->
<section class="related"><h2>Related tools</h2><div class="cards">
${relatedHtml}
</div></section>
</main>
${FOOTER}
<script src="../assets/app.js"></script>
<script>
${t.pure}
document.addEventListener('DOMContentLoaded', function () {
${t.wiring}
});
</script>
</body>
</html>
`;
}

function indexPage() {
  const cats = ['Finance', 'Everyday'];
  const sections = cats.map(c => {
    const list = tools.filter(t => t.category === c);
    return `<section class="cat" id="${c.toLowerCase()}">
<h2>${c} Tools <span class="count">${list.length}</span></h2>
<p style="color:var(--muted);margin:0 0 6px">${CAT_DESC[c]}</p>
<div class="cards">
${list.map(t => toolCard(t, 'tools/')).join('\n')}
</div></section>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FreeToolHub – Free Online Tools for Everyday India</title>
<meta name="description" content="FreeToolHub offers 22 free online tools for everyday India — EMI, GST, SIP, income tax calculators, QR generator, converters and more. No sign-up, works on mobile.">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<header class="site-header"><div class="wrap">
<a class="logo" href="index.html">Free<span>Tool</span>Hub</a>
<nav class="nav"><a href="index.html">Home</a><a href="#finance">Finance</a><a href="#everyday">Everyday</a></nav>
</div></header>
<section class="hero"><div class="wrap">
<h1>Free Online Tools for Everyday India</h1>
<p>22 fast, free tools — finance calculators, converters, generators and everyday utilities. No sign-up, no downloads, works right in your browser.</p>
<div class="searchbox"><input id="toolSearch" type="search" placeholder="Search tools… e.g. EMI, GST, QR code" aria-label="Search tools"></div>
</div></section>
<main class="wrap">
${sections}
</main>
${FOOTER}
<script src="assets/app.js"></script>
<script>
document.getElementById('toolSearch').addEventListener('input', function () {
  var q = this.value.trim().toLowerCase();
  document.querySelectorAll('.cards .card').forEach(function (c) {
    var hit = !q || c.getAttribute('data-name').indexOf(q) !== -1;
    c.style.display = hit ? '' : 'none';
  });
  document.querySelectorAll('.cat').forEach(function (sec) {
    var visible = 0;
    sec.querySelectorAll('.card').forEach(function (c) { if (c.style.display !== 'none') visible++; });
    sec.style.display = visible ? '' : 'none';
  });
});
</script>
</body>
</html>
`;
}

// ---- emit ----
fs.writeFileSync(path.join(ROOT, 'index.html'), indexPage());
for (const t of tools) {
  fs.writeFileSync(path.join(ROOT, 'tools', t.slug + '.html'), toolPage(t));
}

const urls = ['', ...tools.map(t => 'tools/' + t.slug + '.html')];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
  + urls.map(u => `  <url>\n    <loc>${BASE}${u}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${u === '' ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${u === '' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')
  + `\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

fs.writeFileSync(path.join(ROOT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${BASE}sitemap.xml\n`);

console.log('Built ' + tools.length + ' tool pages + index.html + sitemap.xml + robots.txt');
