# 🐍 Retro Snake AI - Production Build

A nostalgic recreation of the classic Snake game with authentic Windows 95 styling and modern AI-powered enhancements.

## 🎮 Play Now

**[Play the Game](https://rajesh-gheware.github.io/retro-snake-ai/)**

## ✨ Features

### 🎯 Core Gameplay
- **Classic Snake Mechanics**: Arrow key controls, food collection, collision detection
- **Authentic Win95 UI**: Complete window chrome, beveled buttons, retro fonts
- **Smooth 60 FPS Gameplay**: Optimized game loop with crisp pixel rendering
- **High Score Persistence**: Automatic save/load using localStorage

### 🤖 AI-Powered Enhancements
- **AI Opponent Snake**: Compete against an intelligent AI snake
- **Real-time Commentary**: Witty 90s-themed commentary during gameplay
- **Dynamic Difficulty**: Adaptive gameplay that adjusts to your skill level
- **Multiple AI Difficulty Levels**: Easy, Medium, Hard settings

### 🔊 Audio Experience
- **Retro 8-bit Sound Effects**: Generated using Web Audio API
- **Interactive Sound Controls**: Click, scroll, or right-click the sound icon
- **Volume Visualization**: Real-time volume bar in status bar
- **Sound ON by default**: Immersive audio experience from the start

### 📱 Mobile & Responsive
- **Fully Responsive Design**: Works on desktop, tablet, and mobile
- **Touch Controls**: On-screen directional buttons for mobile devices
- **Adaptive UI**: Scales beautifully across all screen sizes
- **Cross-Platform**: Compatible with all modern browsers

### ⌨️ Keyboard Navigation
- **ESC Key**: Close any open dialog or pause/resume game
- **Arrow Keys**: Snake movement during gameplay
- **Space**: Start game
- **P**: Pause/Resume
- **R**: Restart after game over

## 🛠️ Technical Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5 Canvas, CSS3
- **AI Integration**: Amazon Bedrock (Claude 3 Haiku)
- **Audio**: Web Audio API for retro sound generation
- **Storage**: localStorage for settings and high scores
- **Deployment**: GitHub Pages (static hosting)

## 🎨 Design Philosophy

This game recreates the authentic Windows 95 experience with:
- **Pixel-perfect UI**: Authentic beveled borders, inset/outset effects
- **Classic Color Palette**: #C0C0C0 gray, #000080 navy blue
- **MS Sans Serif Font**: True-to-era typography
- **Proper Dialog Boxes**: No browser alerts - all custom Win95 dialogs
- **Status Bar**: Real-time game information display

## 🏆 Game Statistics

Track your progress with detailed statistics:
- Games Played & Won
- Win Rate Percentage  
- High Score & Average Score
- Skill Level (0-100% with labels)

## 🎯 AI Features

### AI Opponent
- **Strategic Decision Making**: Uses Amazon Bedrock for intelligent moves
- **Fallback A* Algorithm**: Works offline with pathfinding AI
- **Configurable Aggression**: Adjusts based on difficulty settings

### AI Commentary
- **Event-Driven**: Reacts to eating food, near misses, victories
- **90s Slang**: "Radical!", "Tubular!", "Bogus!" and more
- **Fallback Comments**: Works without internet connection
- **Rate Limited**: Prevents API overuse

### Dynamic Difficulty
- **Performance Tracking**: Monitors wins, scores, survival time
- **Adaptive Speed**: Game speed adjusts to your skill level
- **AI Behavior Modification**: AI gets smarter as you improve
- **Skill Estimation**: 0-100% skill level with descriptive labels

## 🎮 Controls

### Desktop
- **Arrow Keys**: Move snake
- **Space**: Start game
- **P / ESC**: Pause/Resume (ESC also closes dialogs)
- **R**: Restart after game over

### Mobile
- **Touch Buttons**: Directional arrows and pause/play
- **Sound Icon**: Tap to toggle, right-click for volume, scroll to adjust

## 🚀 Performance

- **60 FPS Target**: Smooth gameplay on all devices
- **Optimized Rendering**: Efficient canvas drawing with image-rendering: pixelated
- **Minimal Dependencies**: Zero runtime dependencies for core gameplay
- **Fast Loading**: Lightweight vanilla JavaScript implementation

## 👨‍💻 Author

**Rajesh Gheware**  
[LinkedIn](https://linkedin.com/in/rajesh-gheware)

*Created for the AI for Bharat hackathon - December 2025*

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy the nostalgic gaming experience! 🎮✨**