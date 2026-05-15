const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public');

const files = [
  'about.html',
  'contact.html',
  'index.html',
  'manifest.json',
  'portfolio.html',
  'pricing.html',
  'services.html',
  'services_fixed.html',
  'sw.js',
];

const directories = ['css', 'js'];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const file of files) {
  const source = path.join(root, file);

  if (fs.existsSync(source)) {
    fs.copyFileSync(source, path.join(output, file));
  }
}

for (const directory of directories) {
  const source = path.join(root, directory);

  if (fs.existsSync(source)) {
    fs.cpSync(source, path.join(output, directory), { recursive: true });
  }
}

console.log('Built static site into public/');
