# Project Structure

## Directory Layout

```
retro-snake-ai/
├── index.html                 # Main entry point
├── css/
│   ├── win95.css              # Windows 95 styling
│   └── game.css               # Game-specific styles
├── js/
│   ├── main.js                # Entry point, initialization
│   ├── config.js              # Game configuration
│   ├── game.js                # Game engine class
│   ├── snake.js               # Snake entity class
│   ├── food.js                # Food entity class
│   ├── ai-service.js          # Bedrock AI integration
│   ├── ai-pathfinding.js      # A* fallback algorithm
│   ├── commentary.js          # AI commentary system
│   ├── difficulty.js          # Difficulty management
│   ├── ui.js                  # Win95 UI components
│   ├── menu.js                # Menu bar functionality
│   └── sounds.js              # Audio management
├── assets/
│   ├── fonts/
│   │   └── ms-sans-serif.woff2
│   ├── sounds/
│   │   ├── eat.wav
│   │   ├── die.wav
│   │   └── start.wav
│   └── images/
│       └── icon.png
├── .kiro/
│   ├── steering/
│   │   ├── product.md         # Product vision
│   │   ├── tech.md            # Tech stack
│   │   └── structure.md       # This file
│   └── specs/
│       ├── snake-game/
│       │   ├── requirements.md
│       │   ├── design.md
│       │   └── tasks.md
│       ├── ai-opponent/
│       │   ├── requirements.md
│       │   ├── design.md
│       │   └── tasks.md
│       ├── ai-commentary/
│       │   ├── requirements.md
│       │   ├── design.md
│       │   └── tasks.md
│       └── dynamic-difficulty/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
├── package.json               # npm configuration
├── vite.config.js             # Vite build config (optional)
├── README.md                  # Project documentation
└── .gitignore
```

## File Descriptions

### Root Files
| File | Purpose |
|------|---------|
| index.html | Single-page application entry |
| package.json | Dependencies and scripts |
| README.md | Project documentation |

### JavaScript Modules
| File | Responsibility |
|------|----------------|
| main.js | App initialization, event binding |
| config.js | Game constants and settings |
| game.js | Game loop, state management |
| snake.js | Snake entity, movement logic |
| food.js | Food spawning, positioning |
| ai-service.js | Bedrock API calls |
| ai-pathfinding.js | A* algorithm for offline |
| commentary.js | Event-triggered comments |
| difficulty.js | Adaptive difficulty system |
| ui.js | Win95 window components |
| menu.js | Dropdown menus |
| sounds.js | Audio playback |

### CSS Files
| File | Purpose |
|------|---------|
| win95.css | Window chrome, buttons, menus |
| game.css | Canvas, overlays, animations |

### Asset Organization
- **fonts/**: Retro system fonts
- **sounds/**: 8-bit WAV effects
- **images/**: Icons and sprites

## Module Dependencies

```
main.js
├── config.js
├── game.js
│   ├── snake.js
│   ├── food.js
│   └── ai-service.js
│       └── ai-pathfinding.js
├── commentary.js
│   └── ai-service.js
├── difficulty.js
├── ui.js
│   └── menu.js
└── sounds.js
```

## Import Pattern

Using ES6 modules:
```javascript
// main.js
import { CONFIG } from './config.js';
import { Game } from './game.js';
import { UIManager } from './ui.js';
```
