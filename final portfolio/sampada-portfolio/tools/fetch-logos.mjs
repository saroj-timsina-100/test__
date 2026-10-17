// Downloads the official logo files into assets/logos/ and rebuilds the site.
// Run on a computer with internet access:   node tools/fetch-logos.mjs
// Sources are the companies' own websites (found in their page headers/footers).
import { writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const logos = [
  { file: 'black-tech.png', url: 'https://www.blacktech.com.np/logo-full.png', from: 'blacktech.com.np footer logo' },
  { file: 'everacy.png', url: 'https://everacylanding.everacy.com/media/footer/logo/Everacy_Final_PNG-8.png', from: 'everacy.com footer logo' },
  // XAV Technology and Urja Tech: their pages do not expose a downloadable logo file we could verify.
  // Save the logo yourself as assets/logos/xav-technology.png and assets/logos/urja-tech.png
  // (transparent PNG or SVG; for SVG also change the file name in content/site.mjs).
];

mkdirSync('assets/logos', { recursive: true });
for (const l of logos) {
  try {
    const r = await fetch(l.url);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    writeFileSync('assets/logos/' + l.file, Buffer.from(await r.arrayBuffer()));
    console.log('saved  ', l.file, '(' + l.from + ')');
  } catch (e) {
    console.log('FAILED ', l.file, e.message, '-', l.url);
  }
}
execSync('node build.mjs', { stdio: 'inherit' });
