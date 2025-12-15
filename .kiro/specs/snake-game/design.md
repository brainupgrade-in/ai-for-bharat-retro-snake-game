# Design: Core Snake Game

## Overview

This design document outlines the implementation of a classic Snake game with Windows 95 retro aesthetic. The system provides traditional snake gameplay mechanics including movement, food collection, collision detection, and score tracking, all wrapped in an authentic retro user interface.

## Architecture

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

## Components and Interfaces

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

## Data Models

### Game State Model
```javascript
{
  state: 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER',
  score: number,
  highScore: number,
  gameSpeed: number,
  lastUpdate: number
}
```

### Snake Model
```javascript
{
  body: Array<{x: number, y: number}>,
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT',
  nextDirection: string,
  color: string,
  alive: boolean
}
```

### Food Model
```javascript
{
  position: {x: number, y: number},
  color: string
}
```

### localStorage Schema
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

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Property 1: Continuous snake movement**
*For any* game instance in PLAYING state, the Player_Snake should move automatically in its current direction without requiring user input
**Validates: Requirements 1.1**

**Property 2: Direction change responsiveness**
*For any* valid arrow key input during PLAYING state, the Player_Snake direction should change accordingly
**Validates: Requirements 1.2**

**Property 3: Reverse direction prevention**
*For any* attempt to move in the opposite direction, the input should be ignored and the snake should continue in its current direction
**Validates: Requirements 1.3**

**Property 4: Grid-based movement**
*For any* snake movement, the position should update by exactly one cell on the Game_Grid
**Validates: Requirements 1.4**

**Property 5: Food visual representation**
*For any* spawned Food_Item, it should be displayed as a distinct colored circle
**Validates: Requirements 2.1**

**Property 6: Snake growth on food consumption**
*For any* collision between Player_Snake head and Food_Item, the snake should grow by exactly one segment
**Validates: Requirements 2.2**

**Property 7: Food respawning**
*For any* food consumption event, a new Food_Item should spawn immediately
**Validates: Requirements 2.3**

**Property 8: Food spawn collision avoidance**
*For any* food spawning event, the new Food_Item should not appear on any Player_Snake body segment
**Validates: Requirements 2.4**

**Property 9: Score increment**
*For any* food consumption event, the score should increase by exactly 1
**Validates: Requirements 2.5**

**Property 10: Wall collision detection**
*For any* Player_Snake head position outside Game_Grid boundaries, the game should end
**Validates: Requirements 3.1**

**Property 11: Self-collision detection**
*For any* Player_Snake head position that matches a body segment position, the game should end
**Validates: Requirements 3.2**

**Property 12: Game over message display**
*For any* game ending event, a clear "Game Over" message should be displayed
**Validates: Requirements 3.3**

**Property 13: Final score display**
*For any* game ending event, the final score should be shown to the player
**Validates: Requirements 3.4**

**Property 14: Continuous score display**
*For any* moment during PLAYING state, the current score should be visible in the Status_Bar
**Validates: Requirements 4.1**

**Property 15: High score persistence**
*For any* game ending event, if the score exceeds the stored high score, it should be persisted to localStorage
**Validates: Requirements 4.2**

**Property 16: High score display on game over**
*For any* game over screen, the high score should be displayed
**Validates: Requirements 4.3**

**Property 17: High score notification**
*For any* new high score achievement, a notification should be shown
**Validates: Requirements 4.4**

**Property 18: Game start on SPACE**
*For any* SPACE key press while in START state, the game should transition to PLAYING state
**Validates: Requirements 5.2**

**Property 19: Pause/resume toggle**
*For any* P or ESC key press during PLAYING or PAUSED state, the game should toggle between these states
**Validates: Requirements 5.3**

**Property 20: Pause overlay display**
*For any* PAUSED state, a pause overlay should be displayed
**Validates: Requirements 5.4**

**Property 21: Game restart on R**
*For any* R key press while in GAME_OVER state, the game should restart to initial state
**Validates: Requirements 5.5**

**Property 22: Win95 button styling**
*For any* rendered button, it should use classic gray beveled styling
**Validates: Requirements 6.2**

**Property 23: Retro font usage**
*For any* displayed text, it should use retro pixelated fonts
**Validates: Requirements 6.3**

**Property 24: Menu dropdown functionality**
*For any* menu item click, a dropdown menu should be displayed
**Validates: Requirements 6.4**

**Property 25: Status bar presence**
*For any* display state, a Status_Bar containing the score should be visible
**Validates: Requirements 6.5**

## Error Handling

### Input Validation
- Invalid key presses are ignored during gameplay
- Direction changes are validated against current direction to prevent reversal
- Game state transitions are validated to prevent invalid state changes

### Collision Detection Errors
- Wall collision detection handles edge cases at grid boundaries
- Self-collision detection accounts for snake growth timing
- Food collision detection handles simultaneous events

### Storage Errors
- localStorage failures are handled gracefully with fallback to session storage
- High score corruption is handled by resetting to 0
- Settings corruption falls back to default values

### Rendering Errors
- Canvas context failures are handled with error messages
- Animation frame failures fall back to setTimeout
- Font loading failures fall back to system fonts

## Testing Strategy

### Unit Testing Approach
The system will use unit tests to verify specific examples, edge cases, and error conditions:
- Specific game state transitions (START → PLAYING → GAME_OVER)
- Edge cases like snake at grid boundaries
- Error conditions like localStorage failures
- Integration points between Game, Snake, and Food classes

### Property-Based Testing Approach
The system will use property-based testing to verify universal properties across all inputs:
- **Testing Framework**: fast-check (JavaScript property-based testing library)
- **Test Configuration**: Minimum 100 iterations per property test
- **Property Implementation**: Each correctness property will be implemented as a single property-based test
- **Test Annotation**: Each property test will be tagged with the format: '**Feature: snake-game, Property {number}: {property_text}**'

Property-based tests will generate random game states, input sequences, and scenarios to verify that the correctness properties hold across all valid executions. This approach complements unit tests by providing comprehensive coverage of the input space and catching edge cases that might be missed by example-based testing.

Both testing approaches are essential: unit tests catch concrete bugs and verify specific behaviors, while property tests verify general correctness and system invariants across all possible inputs.