# Design: Core Snake Game

## Architecture Overview

```
┌─────────────────────────────────────────┐
│              index.html                 │
│  ┌─────────────────────────────────┐    │
│  │      Win95 Window Frame         │    │
│  │  ┌───────────────────────────┐  │    │
│  │  │     HTML5 Canvas          │  │    │
│  │  │     (Game Board)          │  │    │
│  │  └───────────────────────────┘  │    │
│  │  ┌───────────────────────────┐  │    │
│  │  │     Status Bar            │  │    │
│  │  └───────────────────────────┘  │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## Components

### Game Class
Primary game controller managing state and loop.

```javascript
class Game {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  state: 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'
  playerSnake: Snake
  food: Food
  score: number
  highScore: number
  gameSpeed: number
  lastUpdate: number

  constructor(canvas)
  start()
  pause()
  resume()
  reset()
  update()
  render()
  gameLoop(timestamp)
}
```

### Snake Class
Entity representing player or AI snake.

```javascript
class Snake {
  body: Array<{x: number, y: number}>
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
  nextDirection: string
  color: string
  alive: boolean

  constructor(startX, startY, color)
  move()
  grow()
  setDirection(dir)
  checkSelfCollision(): boolean
  getHead(): {x, y}
}
```

### Food Class
Food entity with spawn logic.

```javascript
class Food {
  position: {x: number, y: number}
  color: string

  constructor()
  spawn(avoidPositions: Array<{x,y}>)
  getPosition(): {x, y}
}
```

## Data Flow

```
User Input (Keyboard)
        │
        ▼
┌───────────────────┐
│ Event Listener    │
│ (main.js)         │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Game.setDirection │
│ (queued)          │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐     ┌──────────────┐
│ Game Loop         │────►│ Render       │
│ (requestAnimFrame)│     │ (60 FPS)     │
└────────┬──────────┘     └──────────────┘
         │
         │ Every 150ms
         ▼
┌───────────────────┐
│ Update:           │
│ - Move snakes     │
│ - Check collisions│
│ - Spawn food      │
│ - Update score    │
└───────────────────┘
```

## State Machine

```
         ┌─────────┐
         │  START  │
         └────┬────┘
              │ SPACE
              ▼
         ┌─────────┐
    ┌───►│ PLAYING │◄───┐
    │    └────┬────┘    │
    │         │ P/ESC   │ P/ESC
    │         ▼         │
    │    ┌─────────┐    │
    │    │ PAUSED  │────┘
    │    └─────────┘
    │
    │ R   collision
    │         │
    │         ▼
    │    ┌──────────┐
    └────┤GAME_OVER │
         └──────────┘
```

## UI Layout

```
┌─────────────────────────────────────────────┐
│ [🐍] Snake Game                  [_][□][X]  │ ← Title bar
├─────────────────────────────────────────────┤
│ Game   Options   Help                       │ ← Menu bar
├─────────────────────────────────────────────┤
│                                             │
│    ┌───────────────────────────────────┐    │
│    │                                   │    │
│    │         400x400 Canvas            │    │
│    │         (20x20 grid)              │    │
│    │                                   │    │
│    └───────────────────────────────────┘    │
│                                             │
├─────────────────────────────────────────────┤
│ Score: 0       High Score: 15      AI: ON   │ ← Status bar
└─────────────────────────────────────────────┘
```

## Color Scheme

| Element | Hex Code |
|---------|----------|
| Window background | #C0C0C0 |
| Title bar | #000080 |
| Title text | #FFFFFF |
| Button face | #C0C0C0 |
| Button highlight | #FFFFFF |
| Button shadow | #808080 |
| Game background | #003300 |
| Player snake | #00FF00 |
| Snake head | #00CC00 |
| Food | #FF0000 |

## Keyboard Mapping

| Key | Action | State Required |
|-----|--------|----------------|
| ArrowUp | Move up | PLAYING |
| ArrowDown | Move down | PLAYING |
| ArrowLeft | Move left | PLAYING |
| ArrowRight | Move right | PLAYING |
| Space | Start game | START |
| P / Escape | Toggle pause | PLAYING/PAUSED |
| R | Restart | GAME_OVER |

## Collision Detection

```javascript
// Wall collision
if (head.x < 0 || head.x >= GRID_SIZE ||
    head.y < 0 || head.y >= GRID_SIZE) {
  return 'WALL';
}

// Self collision
for (let i = 1; i < body.length; i++) {
  if (head.x === body[i].x && head.y === body[i].y) {
    return 'SELF';
  }
}

// Food collision
if (head.x === food.x && head.y === food.y) {
  return 'FOOD';
}
```

## localStorage Schema

```javascript
{
  "snakeHighScore": 15,
  "snakeSettings": {
    "aiEnabled": true,
    "commentaryEnabled": true,
    "difficulty": "MEDIUM",
    "soundEnabled": true
  }
}
```
