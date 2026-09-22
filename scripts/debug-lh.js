const { execSync } = require('child_process');
const fs = require('fs');

const cmd = 'npx -y lighthouse http://localhost:3000/product/n-type-topcon-bifacial-module-620w --output=json --output-path=lh-debug.json --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,seo --form-factor=mobile --quiet';
execSync(cmd, { stdio: 'inherit' });
const r = JSON.parse(fs.readFileSync('lh-debug.json', 'utf8'));

console.log('SEO Audits failing:');
for (const [id, a] of Object.entries(r.audits)) {
  if (r.categories.seo.auditRefs.some(ref => ref.id === id) && a.score !== null && a.score < 1) {
    console.log('-', id, ':', a.title, '=>', a.explanation || a.displayValue || JSON.stringify(a.details?.items || []));
  }
}

console.log('\nPerf Audits with high impact:');
for (const [id, a] of Object.entries(r.audits)) {
  if (r.categories.performance.auditRefs.some(ref => ref.id === id) && a.score !== null && a.score < 0.9) {
    console.log('-', id, ':', a.title, '=> score:', a.score, 'displayValue:', a.displayValue);
  }
}

if (fs.existsSync('lh-debug.json')) fs.unlinkSync('lh-debug.json');
