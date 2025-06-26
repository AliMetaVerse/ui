#!/usr/bin/env node

/**
 * Webropol Page Validation Script
 * 
 * This script validates that all HTML pages in the webropol folder
 * have the required sidebar and header components properly configured.
 */

const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && item !== 'components') {
      findHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html') && !item.includes('template')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function validatePage(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  const issues = [];
  
  // Check for required components
  if (!content.includes('<webropol-sidebar')) {
    issues.push('Missing webropol-sidebar component');
  }
  
  if (!content.includes('<webropol-header')) {
    issues.push('Missing webropol-header component');
  }
  
  if (!content.includes('<webropol-breadcrumbs')) {
    issues.push('Missing webropol-breadcrumbs component');
  }
  
  // Check for required scripts
  if (!content.includes('sidebar.js')) {
    issues.push('Missing sidebar.js script import');
  }
  
  if (!content.includes('header.js')) {
    issues.push('Missing header.js script import');
  }
  
  if (!content.includes('breadcrumbs.js')) {
    issues.push('Missing breadcrumbs.js script import');
  }
  
  // Check for proper HTML structure
  if (!content.includes('class="flex h-screen"')) {
    issues.push('Missing proper layout structure');
  }
  
  return {
    file: relativePath,
    issues: issues,
    valid: issues.length === 0
  };
}

function main() {
  console.log('🔍 Validating Webropol pages for sidebar and header components...\n');
  
  const webropelDir = './webropol';
  
  if (!fs.existsSync(webropelDir)) {
    console.error('❌ Webropol directory not found. Please run this script from the ui folder.');
    process.exit(1);
  }
  
  const htmlFiles = findHtmlFiles(webropelDir);
  const results = htmlFiles.map(validatePage);
  
  const validPages = results.filter(r => r.valid);
  const invalidPages = results.filter(r => !r.valid);
  
  console.log(`📊 Validation Summary:`);
  console.log(`   Total pages: ${results.length}`);
  console.log(`   ✅ Valid pages: ${validPages.length}`);
  console.log(`   ❌ Invalid pages: ${invalidPages.length}\n`);
  
  if (validPages.length > 0) {
    console.log('✅ Pages with proper sidebar and header:');
    validPages.forEach(page => {
      console.log(`   ✓ ${page.file}`);
    });
    console.log();
  }
  
  if (invalidPages.length > 0) {
    console.log('❌ Pages needing updates:');
    invalidPages.forEach(page => {
      console.log(`   ❌ ${page.file}`);
      page.issues.forEach(issue => {
        console.log(`      - ${issue}`);
      });
      console.log();
    });
    
    console.log('💡 To fix these pages:');
    console.log('   1. Use the page-template.html as a reference');
    console.log('   2. Follow the SIDEBAR-HEADER-GUIDE.md instructions');
    console.log('   3. Ensure proper script imports and component usage\n');
  } else {
    console.log('🎉 All pages are properly configured with sidebar and header components!');
  }
  
  process.exit(invalidPages.length > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = { validatePage, findHtmlFiles };
