#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build configuration
const BUILD_DIR = 'docs';
const SOURCE_FILES = [
    'index.html',
    'css/',
    'js/',
    'assets/',
    'package.json'
];

// Files to exclude from the build
const EXCLUDE_PATTERNS = [
    /\.test\.js$/,
    /node_modules/,
    /\.git/,
    /\.kiro/,
    /build\.js$/,
    /\.md$/
];

console.log('🚀 Building Snake Game for production...\n');

// Clean and create dist directory
if (fs.existsSync(BUILD_DIR)) {
    fs.rmSync(BUILD_DIR, { recursive: true, force: true });
    console.log('✅ Cleaned existing docs directory');
}

fs.mkdirSync(BUILD_DIR, { recursive: true });
console.log('✅ Created docs directory');

// Copy files recursively
function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    
    if (stats.isDirectory()) {
        // Create directory if it doesn't exist
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        // Copy all files in directory
        const files = fs.readdirSync(src);
        files.forEach(file => {
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);
            
            // Check if file should be excluded
            const shouldExclude = EXCLUDE_PATTERNS.some(pattern => 
                pattern.test(srcPath) || pattern.test(file)
            );
            
            if (!shouldExclude) {
                copyRecursive(srcPath, destPath);
            }
        });
    } else {
        // Copy file
        fs.copyFileSync(src, dest);
        console.log(`📄 Copied: ${src} → ${dest}`);
    }
}

// Copy source files to dist
SOURCE_FILES.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(__dirname, BUILD_DIR, file);
    
    if (fs.existsSync(srcPath)) {
        copyRecursive(srcPath, destPath);
    } else {
        console.log(`⚠️  Warning: ${file} not found, skipping...`);
    }
});

// Create a production-optimized index.html
const indexPath = path.join(__dirname, BUILD_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Add production meta tags and optimizations
    const productionMeta = `
    <!-- Production build for GitHub Pages -->
    <meta name="description" content="Retro Snake Game with Windows 95 styling - AI for Bharat Hackathon">
    <meta name="keywords" content="snake game, retro, windows 95, javascript, html5, canvas">
    <meta name="author" content="AI for Bharat Hackathon">
    <meta property="og:title" content="Retro Snake Game">
    <meta property="og:description" content="Classic Snake game with authentic Windows 95 styling">
    <meta property="og:type" content="website">
    <link rel="icon" type="image/x-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐍</text></svg>">`;
    
    // Insert meta tags after the existing meta tags
    indexContent = indexContent.replace(
        '<title>Snake Game - Windows 95 Style</title>',
        `<title>Retro Snake Game - Windows 95 Style</title>${productionMeta}`
    );
    
    fs.writeFileSync(indexPath, indexContent);
    console.log('✅ Optimized index.html for production');
}

// Create README for GitHub Pages
const readmeContent = `# Retro Snake Game 🐍

A nostalgic recreation of the classic Snake game with authentic Windows 95 styling.

## 🎮 Play the Game

**[Play Now on GitHub Pages](https://your-username.github.io/your-repo-name/)**

## 🎯 Features

- **Authentic Windows 95 UI** - Complete with title bar, menu system, and retro styling
- **Classic Snake Gameplay** - Arrow key controls, food collection, collision detection
- **Score System** - Current score display and high score persistence
- **Game States** - Start screen, pause functionality, game over screen
- **Responsive Design** - Works on desktop browsers
- **Menu System** - Functional Game, Options, and Help menus

## 🎮 Controls

- **Arrow Keys** - Move the snake
- **SPACE** - Start the game
- **P or ESC** - Pause/Resume
- **R** - Restart after game over

## 🏆 Objective

- Eat the red food to grow your snake
- Avoid hitting walls or your own body
- Try to achieve the highest score!

## 🛠️ Built With

- Vanilla JavaScript (ES6+)
- HTML5 Canvas API
- CSS3 with Windows 95 styling
- Property-based testing with fast-check

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

*Created for the AI for Bharat hackathon - showcasing retro gaming with modern web technologies.*
`;

fs.writeFileSync(path.join(__dirname, BUILD_DIR, 'README.md'), readmeContent);
console.log('✅ Created README.md for GitHub Pages');

// Create .nojekyll file to prevent Jekyll processing
fs.writeFileSync(path.join(__dirname, BUILD_DIR, '.nojekyll'), '');
console.log('✅ Created .nojekyll file for GitHub Pages');

console.log('\n🎉 Production build completed successfully!');
console.log(`📁 Build output: ${BUILD_DIR}/ (ready for GitHub Pages)`);
console.log('\n📋 Next steps for GitHub Pages deployment:');
console.log('1. Push the docs/ folder to your repository');
console.log('2. Go to your GitHub repository settings');
console.log('3. Navigate to Pages section');
console.log('4. Set source to "Deploy from a branch"');
console.log('5. Select "main" branch and "/docs" folder');
console.log('6. Save and wait for deployment');
console.log('\n🌐 Your game will be available at: https://brainupgrade-in.github.io/ai-for-bharat-retro-snake-game/');