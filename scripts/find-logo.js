const https = require('https');

https.get('https://bsreabd.org/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/https:\/\/[^\s"'<>]+\.(?:png|jpg|jpeg|svg|webp)/gi);
    if (matches) {
      const filtered = Array.from(new Set(matches)).filter(m => 
        m.toLowerCase().includes('logo') || 
        m.toLowerCase().includes('bsrea') ||
        m.toLowerCase().includes('cropped') ||
        m.toLowerCase().includes('custom')
      );
      console.log('Found logos:', filtered);
    } else {
      console.log('No matches');
    }
  });
}).on('error', err => console.error(err));
