# Implementation Plan

- [x] 1. Set up project structure and core files
  - Create index.html with basic HTML5 structure and canvas element
  - Create css/win95.css with Windows 95 retro styling framework
  - Create css/game.css for game-specific canvas and overlay styles
  - Create js/config.js with game constants (grid size, colors, speeds)
  - Set up ES6 module structure for JavaScript files
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 2. Implement Snake entity class
  - Create js/snake.js with Snake class and constructor
  - Implement body array initialization with starting position
  - Implement move() method for grid-based movement
  - Implement setDirection() method with reverse direction prevention
  - Implement grow() method to add segments when food is eaten
  - Implement checkSelfCollision() method for body collision detection
  - Implement getHead() helper method to return head position
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.2, 3.2_

- [x] 2.1 Write property test for snake movement
  - **Property 1: Continuous snake movement**
  - **Validates: Requirements 1.1**

- [x] 2.2 Write property test for direction changes
  - **Property 2: Direction change responsiveness**
  - **Validates: Requirements 1.2**

- [x] 2.3 Write property test for reverse direction prevention
  - **Property 3: Reverse direction prevention**
  - **Validates: Requirements 1.3**

- [x] 2.4 Write property test for grid-based movement
  - **Property 4: Grid-based movement**
  - **Validates: Requirements 1.4**

- [x] 2.5 Write property test for snake growth
  - **Property 6: Snake growth on food consumption**
  - **Validates: Requirements 2.2**

- [x] 2.6 Write property test for self-collision detection
  - **Property 11: Self-collision detection**
  - **Validates: Requirements 3.2**

- [x] 3. Implement Food entity class
  - Create js/food.js with Food class and constructor
  - Implement spawn() method with random position generation
  - Implement collision avoidance to prevent spawning on snake body
  - Implement getPosition() method to return current food position
  - _Requirements: 2.1, 2.3, 2.4_

- [x] 3.1 Write property test for food visual representation
  - **Property 5: Food visual representation**
  - **Validates: Requirements 2.1**

- [x] 3.2 Write property test for food respawning
  - **Property 7: Food respawning**
  - **Validates: Requirements 2.3**

- [x] 3.3 Write property test for food spawn collision avoidance
  - **Property 8: Food spawn collision avoidance**
  - **Validates: Requirements 2.4**

- [x] 4. Create core Game engine class
  - Create js/game.js with Game class and constructor
  - Set up HTML5 Canvas context and basic rendering setup
  - Implement game state management (START, PLAYING, PAUSED, GAME_OVER)
  - Implement gameLoop() using requestAnimationFrame for 60 FPS
  - Implement update() method for game logic updates every 150ms
  - Implement basic render() method for drawing game elements
  - _Requirements: 1.1, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5. Implement collision detection systems
  - Add wall collision detection for game boundaries
  - Add food collision detection for snake head and food position
  - Implement game ending logic when collisions occur
  - Add score increment logic when food is consumed
  - _Requirements: 2.5, 3.1, 3.2, 3.3, 3.4_

- [x] 5.1 Write property test for score increment
  - **Property 9: Score increment**
  - **Validates: Requirements 2.5**

- [x] 5.2 Write property test for wall collision detection
  - **Property 10: Wall collision detection**
  - **Validates: Requirements 3.1**

- [x] 5.3 Write property test for game over message display
  - **Property 12: Game over message display**
  - **Validates: Requirements 3.3**

- [x] 5.4 Write property test for final score display
  - **Property 13: Final score display**
  - **Validates: Requirements 3.4**

- [-] 6. Implement keyboard controls and input handling
  - Create js/main.js as entry point with event listener setup
  - Add keyboard event listeners for arrow keys, SPACE, P, ESC, R
  - Implement arrow key direction changes during PLAYING state
  - Implement SPACE key to start game from START state
  - Implement P/ESC keys for pause/resume functionality
  - Implement R key for game restart from GAME_OVER state
  - _Requirements: 1.2, 5.2, 5.3, 5.5_

- [ ] 6.1 Write property test for game start on SPACE
  - **Property 18: Game start on SPACE**
  - **Validates: Requirements 5.2**

- [ ] 6.2 Write property test for pause/resume toggle
  - **Property 19: Pause/resume toggle**
  - **Validates: Requirements 5.3**

- [ ] 6.3 Write property test for game restart on R
  - **Property 21: Game restart on R**
  - **Validates: Requirements 5.5**

- [ ] 7. Implement score tracking and persistence
  - Add current score display in status bar during gameplay
  - Implement high score persistence using localStorage
  - Add high score display on game over screen
  - Implement high score notification when new record is achieved
  - Handle localStorage errors gracefully with fallbacks
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 7.1 Write property test for continuous score display
  - **Property 14: Continuous score display**
  - **Validates: Requirements 4.1**

- [ ] 7.2 Write property test for high score persistence
  - **Property 15: High score persistence**
  - **Validates: Requirements 4.2**

- [ ] 7.3 Write property test for high score display on game over
  - **Property 16: High score display on game over**
  - **Validates: Requirements 4.3**

- [ ] 7.4 Write property test for high score notification
  - **Property 17: High score notification**
  - **Validates: Requirements 4.4**

- [ ] 8. Create Windows 95 UI components
  - Implement window frame with title bar and control buttons
  - Create menu bar with Game, Options, Help dropdowns
  - Style all buttons with classic gray beveled appearance
  - Load and apply retro pixelated fonts (MS Sans Serif style)
  - Create status bar component for score display
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 8.1 Write property test for Win95 button styling
  - **Property 22: Win95 button styling**
  - **Validates: Requirements 6.2**

- [ ] 8.2 Write property test for retro font usage
  - **Property 23: Retro font usage**
  - **Validates: Requirements 6.3**

- [ ] 8.3 Write property test for menu dropdown functionality
  - **Property 24: Menu dropdown functionality**
  - **Validates: Requirements 6.4**

- [ ] 8.4 Write property test for status bar presence
  - **Property 25: Status bar presence**
  - **Validates: Requirements 6.5**

- [ ] 9. Implement game state screens and overlays
  - Create start screen with game instructions and SPACE prompt
  - Implement pause overlay with resume instructions
  - Create game over screen with final score and restart option
  - Add smooth transitions between different game states
  - _Requirements: 5.1, 5.4, 3.3, 3.4_

- [ ] 9.1 Write property test for pause overlay display
  - **Property 20: Pause overlay display**
  - **Validates: Requirements 5.4**

- [ ] 10. Implement complete rendering system
  - Render game background with retro green color scheme
  - Render snake body segments with distinct head coloring
  - Render food items as red circles
  - Render all UI text with retro fonts
  - Implement smooth animations and visual feedback
  - _Requirements: 1.1, 2.1, 6.3_

- [ ] 11. Final integration and testing
  - Integrate all components into working game
  - Test all game states and transitions
  - Verify all collision scenarios work correctly
  - Test score persistence across browser sessions
  - Handle edge cases and error conditions
  - _Requirements: All requirements_

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.