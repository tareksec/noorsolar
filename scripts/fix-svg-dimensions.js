const fs = require('fs');
const path = require('path');

function fixSvgInDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fixSvgInDir(fullPath);
    } else if (item.endsWith('.svg')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = content;

      // 1. Replace invalid HTML entity &bull; with unicode bullet
      if (updated.includes('&bull;')) {
        updated = updated.replace(/&bull;/g, '•');
      }

      // 2. Ensure explicit width and height matching viewBox
      const vbMatch = updated.match(/viewBox=['"]\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*['"]/i);
      if (vbMatch) {
        const w = vbMatch[1];
        const h = vbMatch[2];
        updated = updated
          .replace(/width=['"]100%['"]/gi, `width='${w}'`)
          .replace(/height=['"]100%['"]/gi, `height='${h}'`);
      }

      if (updated !== content) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log(`✓ Cleaned XML entities & dimensions for: ${item}`);
      }
    }
  }
}

fixSvgInDir(path.join(__dirname, '..', 'public'));
