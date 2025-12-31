// Build script to bundle SVG icons with the plugin
const fs = require('fs');
const path = require('path');

// Library configurations
const LIBRARIES = {
  boxicons: {
    name: 'Boxicons',
    path: 'assets/icons/Box Icon',
    categories: ['Arrows', 'Buildings', 'Business', 'Communication', 'Design', 
                 'Development', 'Device', 'Document', 'Editor', 'Finance', 
                 'Food', 'Health & Medical', 'Logos', 'Map', 'Media', 
                 'Others', 'System', 'User & Faces', 'Weather']
  },
  vuesax: {
    name: 'Vuesax',
    path: 'assets/icons/Vuesax Icon',
    categories: ['bold', 'outline']
  }
};

/**
 * Reads all SVG files from a directory
 */
function readSVGFiles(dirPath) {
  const svgFiles = [];
  
  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      if (file.endsWith('.svg')) {
        const filePath = path.join(dirPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        svgFiles.push({
          name: file,
          content: content.trim()
        });
      }
    }
  } catch (error) {
    console.warn(`Could not read directory ${dirPath}:`, error.message);
  }
  
  return svgFiles;
}

/**
 * Bundles all icons into a JSON structure
 */
function bundleIcons() {
  const iconData = {};
  
  for (const [key, config] of Object.entries(LIBRARIES)) {
    iconData[key] = {
      name: config.name,
      categories: {}
    };
    
    for (const category of config.categories) {
      const categoryPath = path.join(config.path, category);
      const svgFiles = readSVGFiles(categoryPath);
      
      if (svgFiles.length > 0) {
        iconData[key].categories[category] = svgFiles;
        console.log(`✓ Bundled ${svgFiles.length} icons from ${key}/${category}`);
      }
    }
  }
  
  return iconData;
}

/**
 * Generates the icon data TypeScript file
 */
function generateIconDataFile() {
  console.log('📦 Bundling icon files...\n');
  
  const iconData = bundleIcons();
  
  // Generate TypeScript file with embedded icon data as a const (not export)
  const tsContent = `// Auto-generated icon data - DO NOT EDIT MANUALLY
// Generated on ${new Date().toISOString()}

const ICON_DATA = ${JSON.stringify(iconData, null, 2)} as const;
`;
  
  fs.writeFileSync('src/icon-data.ts', tsContent);
  console.log('\n✅ Icon data bundled successfully to src/icon-data.ts');
  
  // Generate summary
  let totalIcons = 0;
  for (const [key, data] of Object.entries(iconData)) {
    let libraryCount = 0;
    for (const icons of Object.values(data.categories)) {
      libraryCount += icons.length;
    }
    totalIcons += libraryCount;
    console.log(`   ${data.name}: ${libraryCount} icons`);
  }
  console.log(`   Total: ${totalIcons} icons\n`);
}

// Run the build
try {
  generateIconDataFile();
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
