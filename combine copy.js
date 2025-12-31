// Combines icon-data.js and code.js into a single file for Figma
// Also inlines JavaScript files into HTML
const fs = require('fs');

console.log('🔗 Combining JavaScript files...');

const iconData = fs.readFileSync('dist/icon-data.js', 'utf-8');
const codeContent = fs.readFileSync('dist/code.js', 'utf-8');

// Combine both files
const combined = iconData + '\n' + codeContent;

fs.writeFileSync('dist/code.js', combined);

console.log('✅ Combined into dist/code.js');

// Inline JavaScript into HTML
console.log('🔗 Inlining JavaScript into HTML...');

let htmlContent = fs.readFileSync('src/ui.html', 'utf-8');

// Read JS files
const colorsJs = fs.readFileSync('src/colors.js', 'utf-8');
const iconsJs = fs.readFileSync('src/icons.js', 'utf-8');

// Replace script tags with inline content
htmlContent = htmlContent.replace(
  '<script src="colors.js"></script>',
  `<script>\n${colorsJs}\n</script>`
);

htmlContent = htmlContent.replace(
  '<script src="icons.js"></script>',
  `<script>\n${iconsJs}\n</script>`
);

// Write to dist
fs.writeFileSync('dist/ui.html', htmlContent);

console.log('✅ Inlined JavaScript into dist/ui.html');
