const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Load evaluations
const evalFile = fs.readFileSync(path.join(__dirname, 'image-evaluations.js'), 'utf8');
const fn = new Function('require', 'module', 'exports', evalFile + '; return EVALUATIONS;');
const EVALS = fn(require, {}, {});

async function buildTable() {
  const dirs = ['images', 'images 2'];
  const rows = [];
  for (const d of dirs) {
    const dirPath = path.join(__dirname, '..', 'source-images', d);
    if (!fs.existsSync(dirPath)) continue;
    for (const f of fs.readdirSync(dirPath)) {
      const p = path.join(dirPath, f);
      const stat = fs.statSync(p);
      if (!stat.isFile()) continue;
      const meta = await sharp(p).metadata();
      const key = f.replace(/\s*\(\d+\)\.jpg$/, '').replace(/\.jpg$/, '');
      const evalData = EVALS[key] || {
        subject: 'Solar / renewable installation',
        use: 'General background',
        quality: 'Standard stock photo'
      };
      rows.push({
        folder: d,
        file: f,
        sizeKb: Math.round(stat.size / 1024),
        dim: `${meta.width}x${meta.height}`,
        subject: evalData.subject.replace(/\|/g, '-'),
        use: evalData.use.replace(/\|/g, '-'),
        quality: evalData.quality.replace(/\|/g, '-')
      });
    }
  }
  console.log('Total rows:', rows.length);
  rows.sort((a, b) => a.folder.localeCompare(b.folder) || a.file.localeCompare(b.file));
  let md = '| Folder | File | Dimensions | Size (KB) | What It Shows | Best Use On Site | Quality Notes |\n';
  md += '|---|---|---|---|---|---|---|\n';
  for (const r of rows) {
    md += `| ${r.folder} | ${r.file} | ${r.dim} | ${r.sizeKb} | ${r.subject} | ${r.use} | ${r.quality} |\n`;
  }
  fs.writeFileSync(path.join(__dirname, 'inventory_table.md'), md, 'utf8');
  console.log('Successfully wrote inventory_table.md');
}

buildTable().catch(console.error);
