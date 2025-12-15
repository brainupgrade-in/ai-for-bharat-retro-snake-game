# Tasks: Core Snake Game

## Task List

### Setup
- [ ] Create index.html with basic structure (US-006)
- [ ] Create css/win95.css with retro styling (US-006)
- [ ] Create css/game.css for canvas styles (US-006)
- [ ] Create js/config.js with game constants (US-001)
- [ ] Create js/main.js entry point (US-001)

### Snake Entity
- [ ] Create js/snake.js with Snake class (US-001)
- [ ] Implement body array initialization (US-001)
- [ ] Implement move() method for grid movement (US-001)
- [ ] Implement setDirection() with reverse prevention (US-001)
- [ ] Implement grow() method (US-002)
- [ ] Implement checkSelfCollision() (US-003)
- [ ] Implement getHead() helper (US-001)

### Food Entity
- [ ] Create js/food.js with Food class (US-002)
- [ ] Implement spawn() with collision avoidance (US-002)
- [ ] Implement random position generation (US-002)

### Game Engine
- [ ] Create js/game.js with Game class (US-001)
- [ ] Set up HTML5 Canvas context (US-001)
- [ ] Implement game state management (US-005)
- [ ] Implement gameLoop() with requestAnimationFrame (US-001)
- [ ] Implement update() method (US-001)
- [ ] Implement render() method (US-001)
- [ ] Add wall collision detection (US-003)
- [ ] Add food collision detection (US-002)
- [ ] Implement score tracking (US-004)
- [ ] Implement high score persistence (US-004)

### Controls
- [ ] Add keyboard event listeners (US-001)
- [ ] Implement arrow key direction changes (US-001)
- [ ] Implement SPACE to start (US-005)
- [ ] Implement P/ESC for pause (US-005)
- [ ] Implement R for restart (US-005)

### Game States
- [ ] Implement START state with instructions (US-005)
- [ ] Implement PLAYING state (US-005)
- [ ] Implement PAUSED state with overlay (US-005)
- [ ] Implement GAME_OVER state (US-005)
- [ ] Add state transition logic (US-005)

### Windows 95 UI
- [ ] Create window frame with title bar (US-006)
- [ ] Add window control buttons (minimize, maximize, close) (US-006)
- [ ] Create menu bar (Game, Options, Help) (US-006)
- [ ] Implement dropdown menu styling (US-006)
- [ ] Create status bar component (US-006)
- [ ] Style buttons with beveled look (US-006)
- [ ] Add retro font loading (US-006)

### Rendering
- [ ] Render game background (US-006)
- [ ] Render snake body segments (US-001)
- [ ] Render snake head with distinction (US-001)
- [ ] Render food as circle (US-002)
- [ ] Render score in status bar (US-004)
- [ ] Render game over screen (US-003)
- [ ] Render pause overlay (US-005)
- [ ] Render start screen (US-005)

### Polish
- [ ] Add high score notification (US-004)
- [ ] Handle browser tab inactive (pause) (US-005)
- [ ] Test all collision scenarios (US-003)
- [ ] Verify score persistence works (US-004)
