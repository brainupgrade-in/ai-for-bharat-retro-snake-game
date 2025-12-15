# Requirements: Core Snake Game

## Overview
Classic Snake game implementation with Windows 95 retro aesthetic, serving as the foundation for AI-enhanced features.

## User Stories

### US-001: Snake Movement
**As a** player
**I want to** control a snake using arrow keys
**So that** I can navigate the game board to collect food

**Acceptance Criteria:**
- [ ] WHEN the game starts THE SYSTEM SHALL move the snake continuously in the current direction
- [ ] WHEN the player presses an arrow key THE SYSTEM SHALL change the snake direction accordingly
- [ ] WHEN the player attempts to reverse direction THE SYSTEM SHALL ignore the input
- [ ] WHEN the snake moves THE SYSTEM SHALL update position cell by cell on the grid
- [ ] WHEN the game initializes THE SYSTEM SHALL set the default direction to RIGHT

### US-002: Food Collection
**As a** player
**I want to** collect food items to grow my snake
**So that** I can increase my score

**Acceptance Criteria:**
- [ ] WHEN food spawns THE SYSTEM SHALL display it as a distinct colored circle
- [ ] WHEN the snake head reaches the food position THE SYSTEM SHALL grow the snake by one segment
- [ ] WHEN food is eaten THE SYSTEM SHALL spawn new food immediately
- [ ] WHEN spawning food THE SYSTEM SHALL ensure it does not appear on snake body
- [ ] WHEN food is eaten THE SYSTEM SHALL increase the score by 1

### US-003: Collision Detection
**As a** player
**I want** the game to detect when I hit obstacles
**So that** the game ends appropriately

**Acceptance Criteria:**
- [ ] WHEN the snake head hits a wall boundary THE SYSTEM SHALL end the game
- [ ] WHEN the snake head hits its own body THE SYSTEM SHALL end the game
- [ ] WHEN the snake head hits the AI opponent THE SYSTEM SHALL end the game
- [ ] WHEN the game ends THE SYSTEM SHALL display a clear "Game Over" message
- [ ] WHEN the game ends THE SYSTEM SHALL show the final score

### US-004: Score Tracking
**As a** player
**I want to** see my current and high score
**So that** I can track my progress

**Acceptance Criteria:**
- [ ] WHILE playing THE SYSTEM SHALL display the current score in the status bar
- [ ] WHEN a game ends THE SYSTEM SHALL persist the high score to localStorage
- [ ] WHEN the game over screen appears THE SYSTEM SHALL display the high score
- [ ] WHEN a new high score is achieved THE SYSTEM SHALL show a notification

### US-005: Game States
**As a** player
**I want to** start, pause, and restart the game
**So that** I have control over gameplay

**Acceptance Criteria:**
- [ ] WHEN the application loads THE SYSTEM SHALL show a start screen with instructions
- [ ] WHEN the player presses SPACE on start screen THE SYSTEM SHALL begin the game
- [ ] WHEN the player presses P or ESC during gameplay THE SYSTEM SHALL pause/resume
- [ ] WHEN the game is paused THE SYSTEM SHALL display a pause overlay
- [ ] WHEN the player presses R after game over THE SYSTEM SHALL restart the game

### US-006: Windows 95 UI
**As a** player
**I want** the game to look like a Windows 95 application
**So that** I have a nostalgic retro experience

**Acceptance Criteria:**
- [ ] WHEN the game loads THE SYSTEM SHALL display a Win95 window frame with title bar
- [ ] WHEN rendered THE SYSTEM SHALL use classic gray beveled buttons
- [ ] WHEN displaying text THE SYSTEM SHALL use retro pixelated fonts
- [ ] WHEN the player clicks menu items THE SYSTEM SHALL show dropdown menus
- [ ] WHEN displaying THE SYSTEM SHALL include a status bar with score

## Constraints

- Grid size: 20x20 cells
- Cell size: 20x20 pixels
- Initial game speed: 150ms per tick
- Minimum browser: Chrome 90+, Firefox 88+
