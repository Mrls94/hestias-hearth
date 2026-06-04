#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const srcDir = path.join(repoRoot, 'src');
const badPatterns = [
  'react-md-editor/dist/react-md-editor.css',
  '@uiw/react-md-editor/dist/react-md-editor.css',
  '@uiw/react-md-editor/dist/mdeditor.css',
  '@uiw/react-markdown-preview/dist/react-markdown-preview.css'
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full);
    } else if (/\.(js|jsx|ts|tsx|css)$/.test(e.name)) {
      const content = fs.readFileSync(full, 'utf8');
      for (const p of badPatterns) {
        if (content.includes(p)) {
          console.error(`Found deprecated import pattern "${p}" in ${full}`);
          process.exitCode = 1;
        }
      }
    }
  }
}

if (!fs.existsSync(srcDir)) {
  console.error('src directory not found; nothing to check.');
  process.exit(1);
}
walk(srcDir);
if (process.exitCode && process.exitCode !== 0) {
  console.error('check:css-imports failed. Please update imports to use package-exported CSS paths.');
  process.exit(process.exitCode);
}
console.log('check:css-imports passed.');
