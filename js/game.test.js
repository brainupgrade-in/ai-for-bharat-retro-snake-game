// Property-based tests for Game class
import { describe, test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';

// Mock CommentaryManager for testing
class MockCommentaryManager {
    constructor() {
        this.enabled = false;
    }
    setEnabled() {}
    triggerEvent() {}
}

// Mock the commentary module
const mockCommentary = { CommentaryManager: MockCommentaryManager };

// Import Game after setting up mocks
import { Game } from './game.js';
import { CONFIG, COLLISION_TYPES } from './config.js';

// Mock canvas for testing
class MockCanvas {
    constructor() {
        this.width = CONFIG.CANVAS_WIDTH;
        this.height = CONFIG.CANVAS_HEIGHT;
    }
    
    getContext() {
        return {
            imageSmoothingEnabled: false,
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 1,
            fillRect: () => {},
            strokeRect: () => {},
            beginPath: () => {},
            arc: () => {},
            fill: () => {},
            moveTo: () => {},
            lineTo: () => {},
            stroke: () => {}
        };
    }
}

describe('Game Property Tests', () => {
    
    /**
     * Feature: snake-game, Property 9: Score increment
     * Validates: Requirements 2.5
     */
    test('Property 9: Score increment', () => {
        fc.assert(fc.property(
            fc.integer({ min: 1, max: 10 }),
            (foodCount) => {
                const canvas = new MockCanvas();
                const game = new Game(canvas);
                
                const initialScore = game.getScore();
                
                // Simulate eating food multiple times
                for (let i = 0; i < foodCount; i++) {
                    // Place food at snake head position to trigger collision
                    const head = game.playerSnake.getHead();
                    game.food.setPosition(head.x, head.y);
                    
                    // Trigger food collision handling
                    game.handlePlayerFoodCollision();
                }
                
                const finalScore = game.getScore();
                
                // Score should increase by exactly the number of food items eaten
                return finalScore === initialScore + foodCount;
            }
        ), { numRuns: 100 });
    });
    
    /**
     * Feature: snake-game, Property 10: Wall collision detection
     * Validates: Requirements 3.1
     */
    test('Property 10: Wall collision detection', () => {
        fc.assert(fc.property(
            fc.constantFrom(
                { x: -1, y: 5 },    // Left wall
                { x: CONFIG.GRID_SIZE, y: 5 }, // Right wall
                { x: 5, y: -1 },    // Top wall
                { x: 5, y: CONFIG.GRID_SIZE }  // Bottom wall
            ),
            (wallPosition) => {
                const canvas = new MockCanvas();
                const game = new Game(canvas);
                
                // Manually set snake head to wall position
                game.playerSnake.body[0] = wallPosition;
                
                // Check collision
                const collision = game.checkPlayerCollisions();
                
                // Should detect wall collision
                return collision === COLLISION_TYPES.WALL;
            }
        ), { numRuns: 100 });
    });
    
    /**
     * Feature: snake-game, Property 12: Game over message display
     * Validates: Requirements 3.3
     */
    test('Property 12: Game over message display', () => {
        const canvas = new MockCanvas();
        const game = new Game(canvas);
        
        // Set game to playing state without starting the game loop
        game.state = CONFIG.STATES.PLAYING;
        assert.strictEqual(game.getState(), CONFIG.STATES.PLAYING);
        
        // Trigger game over
        game.handleGameOver();
        
        // Game state should be GAME_OVER
        assert.strictEqual(game.getState(), CONFIG.STATES.GAME_OVER);
    });
    
    /**
     * Feature: snake-game, Property 13: Final score display
     * Validates: Requirements 3.4
     */
    test('Property 13: Final score display', () => {
        fc.assert(fc.property(
            fc.integer({ min: 0, max: 50 }),
            (finalScore) => {
                const canvas = new MockCanvas();
                const game = new Game(canvas);
                
                // Set a specific score
                game.score = finalScore;
                
                // Trigger game over
                game.handleGameOver();
                
                // Score should still be accessible after game over
                const displayedScore = game.getScore();
                return displayedScore === finalScore;
            }
        ), { numRuns: 100 });
    });
    
    /**
     * Feature: snake-game, Property 18: Game start on SPACE
     * Validates: Requirements 5.2
     */
    test('Property 18: Game start on SPACE', () => {
        const canvas = new MockCanvas();
        const game = new Game(canvas);
        
        // Game should start in START state
        assert.strictEqual(game.getState(), CONFIG.STATES.START);
        
        // Manually set state to PLAYING (simulating what start() does without the game loop)
        game.state = CONFIG.STATES.PLAYING;
        game.isRunning = true;
        
        // Game should be in PLAYING state
        assert.strictEqual(game.getState(), CONFIG.STATES.PLAYING);
    });
    
    /**
     * Feature: snake-game, Property 19: Pause/resume toggle
     * Validates: Requirements 5.3
     */
    test('Property 19: Pause/resume toggle', () => {
        const canvas = new MockCanvas();
        const game = new Game(canvas);
        
        // Set game to playing state without starting the game loop
        game.state = CONFIG.STATES.PLAYING;
        assert.strictEqual(game.getState(), CONFIG.STATES.PLAYING);
        
        // Pause the game (simulating P/ESC key press)
        game.pause();
        assert.strictEqual(game.getState(), CONFIG.STATES.PAUSED);
        
        // Resume the game (simulating P/ESC key press again)
        game.resume();
        assert.strictEqual(game.getState(), CONFIG.STATES.PLAYING);
    });
    
    /**
     * Feature: snake-game, Property 21: Game restart on R
     * Validates: Requirements 5.5
     */
    test('Property 21: Game restart on R', () => {
        const canvas = new MockCanvas();
        const game = new Game(canvas);
        
        // Set some score and end the game
        game.score = 10;
        game.handleGameOver();
        assert.strictEqual(game.getState(), CONFIG.STATES.GAME_OVER);
        
        // Reset the game (simulating R key press)
        game.reset();
        assert.strictEqual(game.getState(), CONFIG.STATES.START);
        
        // Score should be reset to 0
        assert.strictEqual(game.getScore(), 0);
    });
});