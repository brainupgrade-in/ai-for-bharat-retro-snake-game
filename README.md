# 🐍 Retro Snake AI - Windows 95 Style

A nostalgic recreation of the classic Snake game with authentic Windows 95 styling, built for the **AI for Bharat Hackathon**.

[![Live Demo](https://img.shields.io/badge/🎮_Play_Now-Live_Demo-blue?style=for-the-badge)](https://brainupgrade-in.github.io/ai-for-bharat-retro-snake-game/)
[![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-green?style=flat-square)](https://pages.github.com/)
[![JavaScript](https://img.shields.io/badge/Built_with-Vanilla_JS-yellow?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🎯 Overview

Retro Snake AI combines the beloved classic Snake gameplay with an authentic Windows 95 aesthetic. This browser-based game features pixel-perfect retro styling, complete with window chrome, menu systems, and the nostalgic gray color palette that defined 90s computing.

### ✨ Key Features

- **🖥️ Authentic Windows 95 UI** - Complete window frame, title bar, menu system, and status bar
- **🎮 Classic Snake Gameplay** - Grid-based movement, food collection, and collision detection
- **📊 Score System** - Real-time scoring with persistent high score storage
- **⌨️ Full Keyboard Controls** - Arrow keys, spacebar, pause, and restart functionality
- **🎨 Retro Aesthetics** - MS Sans Serif fonts, beveled buttons, and classic color schemes
- **📱 Responsive Design** - Optimized for desktop browsers with retro charm
- **🧪 Property-Based Testing** - Comprehensive test suite ensuring game reliability

## 🎮 How to Play

### Controls
- **Arrow Keys** (↑↓←→) - Move the snake
- **SPACE** - Start the game
- **P** or **ESC** - Pause/Resume
- **R** - Restart after game over

### Objective
1. **Eat the red food** to grow your snake and increase your score
2. **Avoid walls** and your own body
3. **Achieve the highest score** possible!
4. Game speed increases as your snake grows longer

### Menu System
- **Game Menu** - New Game, Pause, Exit
- **Options Menu** - Sound and Difficulty settings (coming soon)
- **Help Menu** - Instructions and About information

## 🚀 Quick Start

### Play Online
**[🎮 Play the game instantly on GitHub Pages](https://brainupgrade-in.github.io/ai-for-bharat-retro-snake-game/)**

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/brainupgrade-in/ai-for-bharat-retro-snake-game.git
   cd ai-for-bharat-retro-snake-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:8000`

### Build for Production

```bash
# Create production build
npm run build

# Serve production build locally
npm run serve:docs
```

## 🛠️ Technology Stack

### Core Technologies
- **JavaScript (ES6+)** - Modern vanilla JavaScript with modules
- **HTML5 Canvas API** - High-performance 2D rendering
- **CSS3** - Custom Windows 95 styling framework
- **Node.js** - Development tooling and testing

### Development Tools
- **Property-Based Testing** - Using `fast-check` for comprehensive test coverage
- **ES6 Modules** - Clean, modular code architecture
- **Custom Build System** - Optimized production builds for GitHub Pages

### Browser Support
| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## 📁 Project Structure

```
retro-snake-ai/
├── 📄 index.html              # Main game entry point
├── 📁 css/
│   ├── win95.css              # Windows 95 UI framework
│   └── game.css               # Game-specific styles
├── 📁 js/
│   ├── main.js                # Application initialization
│   ├── config.js              # Game configuration constants
│   ├── game.js                # Core game engine
│   ├── snake.js               # Snake entity logic
│   ├── food.js                # Food spawning system
│   └── *.test.js              # Property-based tests
├── 📁 docs/                   # Production build output (GitHub Pages)
├── 📁 .kiro/                  # Development specifications
│   ├── specs/snake-game/      # Feature specifications
│   └── steering/              # Project guidelines
├── 🔧 build.js                # Production build script
├── 📦 package.json            # Dependencies and scripts
└── 📖 README.md               # This file
```

## 🧪 Testing

The project includes comprehensive property-based testing to ensure game reliability:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- **Snake Movement** - Validates continuous movement and direction changes
- **Collision Detection** - Tests wall, food, and self-collision scenarios
- **Game State Management** - Verifies state transitions and game flow
- **Score System** - Ensures accurate scoring and persistence
- **Food Spawning** - Tests random positioning and collision avoidance

## 🎨 Design Philosophy

### Windows 95 Authenticity
- **Color Palette** - Classic `#C0C0C0` gray with navy blue accents
- **Typography** - MS Sans Serif font family for authentic feel
- **UI Elements** - Beveled buttons, inset panels, and outset borders
- **Window Chrome** - Complete title bar with minimize/maximize/close buttons
- **Menu System** - Dropdown menus with hover states and separators

### Modern Development Practices
- **ES6 Modules** - Clean separation of concerns
- **Property-Based Testing** - Comprehensive test coverage
- **Responsive Design** - Adapts to different screen sizes
- **Performance Optimization** - 60 FPS game loop with efficient rendering

## 🚀 Deployment

### GitHub Pages Setup

1. **Push your code** to GitHub
2. **Go to repository Settings** → Pages
3. **Set source** to "Deploy from a branch"
4. **Select** "main" branch and "/docs" folder
5. **Save** and wait for deployment

The game will be available at: `https://brainupgrade-in.github.io/ai-for-bharat-retro-snake-game/`

### Manual Deployment

The `docs/` folder contains a complete, optimized build ready for any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any web server

## 🎯 Future Enhancements

### Planned Features (AI Integration)
- **🤖 AI Opponent Snake** - Powered by Amazon Bedrock
- **💬 AI Commentary** - Real-time witty game commentary
- **📈 Dynamic Difficulty** - Adaptive gameplay based on performance
- **🔊 Sound Effects** - Retro 8-bit audio experience

### Technical Roadmap
- WebGL rendering for enhanced performance
- Mobile touch controls
- Multiplayer support
- Custom themes and skins
- Leaderboard system

## 🏆 AI for Bharat Hackathon

This project was created for the **AI for Bharat Hackathon** to demonstrate:
- **Modern web development** with vanilla JavaScript
- **Retro gaming aesthetics** with contemporary techniques
- **Property-based testing** for reliable software
- **Clean architecture** and modular design
- **Production deployment** with GitHub Pages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Build and test: `npm run build`
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AI for Bharat Hackathon** - For the inspiration and platform
- **Windows 95** - For the timeless UI design that still brings joy
- **Classic Snake Game** - For decades of simple, addictive gameplay
- **Modern Web Standards** - For making retro aesthetics possible in browsers

---

**🎮 [Play the game now!](https://brainupgrade-in.github.io/ai-for-bharat-retro-snake-game/) | 🐍 Built with ❤️ for retro gaming enthusiasts**