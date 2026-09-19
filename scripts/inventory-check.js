const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function listAll() {
  const all = [];
  for (const dir of ['images', 'images 2']) {
    const fullDir = path.join('public', dir);
    if (!fs.existsSync(fullDir)) continue;
    for (const f of fs.readdirSync(fullDir)) {
      const p = path.join(fullDir, f);
      const stat = fs.statSync(p);
      if (stat.isFile()) all.push({ dir, file: f, path: p, size: stat.size });
    }
  }
  console.log('Total files in both dirs:', all.length);

  const groups = new Map();
  for (const item of all) {
    const norm = item.file.replace(/\s*\(\d+\)\.jpg$/, '').replace(/\.jpg$/, '');
    if (!groups.has(norm)) groups.set(norm, []);
    groups.get(norm).push(item);
  }
  console.log('Unique visual assets:', groups.size);

  const entries = [];
  for (const [k, v] of groups.entries()) {
    const largest = v.sort((a, b) => b.size - a.size)[0];
    const meta = await sharp(largest.path).metadata();
    entries.push({
      key: k,
      count: v.length,
      width: meta.width,
      height: meta.height,
      sizeKb: Math.round(largest.size / 1024),
      dir: largest.dir,
      file: largest.file,
      path: largest.path,
    });
  }

  entries.sort((a, b) => a.key.localeCompare(b.key));
  entries.forEach((e, idx) => {
    console.log(`${idx + 1}. [${e.dir}] ${e.file} | ${e.width}x${e.height} (${e.sizeKb} KB, ${e.count} copies)`);
  });
}

listAll().catch(console.error);
