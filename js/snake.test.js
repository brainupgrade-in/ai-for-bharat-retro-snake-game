// Property-based tests for Snake class
import { describe, test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { Snake } from './snake.js';
import { CONFIG } from './config.js';

describe('Snake Property Tests', () => {
    
    /**
     * Feature: snake-game, Property 1: Continuous snake movement
     * Validates: Requirements 1.1
     */
    test('Property 1: Continuous snake movement', () => {
        fc.assert(fc.property(
            fc.constantFrom(...Object.values(CONFIG.DIRECTIONS)),
            fc.integer({ min: 1, max: 100 }),
            (direction, steps) => {
                // Create a fresh snake for each test
                const testSnake = new Snake(10, 10);
                testSnake.setDirection(direction);
                
                const initialHead = testSnake.getHead();
                
                // Move the snake the specified number of steps
                for (let i = 0; i < steps; i++) {
                    testSnake.move();
                }
                
                const finalHead = testSnake.getHead();
                
                // The snake should have moved from its initial position
                const hasMoved = (finalHead.x !== initialHead.x) || (finalHead.y !== initialHead.y);
                
                return hasMoved;
            }
        ), { numRuns: 100 });
    });
    
    /**
     * Feature: snake-game, Property 2: Direction change responsiveness
     * Validates: Requirements 1.2
     */
    test('Property 2: Direction change responsiveness', () => {
        fc.assert(fc.property(
            fc.constantFrom(...Object.values(CONFIG.DIRECTIONS)),
            fc.constantFrom(...Object.values(CONFIG.DIRECTIONS)),
            (initialDirection, newDirection) => {
                // Skip if trying to reverse direction (that's tested separately)
                const opposites = {
                    [CONFIG.DIRECTIONS.UP]: CONFIG.DIRECTIONS.DOWN,
                    [CONFIG.DIRECTIONS.DOWN]: CONFIG.DIRECTIONS.UP,
                    [CONFIG.DIRECTIONS.LEFT]: CONFIG.DIRECTIONS.RIGHT,
                    [CONFIG.DIRECTIONS.RIGHT]: CONFIG.DIRECTIONS.LEFT
                };
                
                if (opposites[initialDirection] === newDirection) {
                    return true; // Skip this test case
                }
                
                // Skip if both directions are the same (no change expected)
                if (initialDirection === newDirection) {
                    return true;
                }
                
                const testSnake = new Snake(10, 10);
                testSnake.setDirection(initialDirection);
                testSnake.move(); // Apply initial direction
                
                testSnake.setDirection(newDirection);
                testSnake.move(); // Apply new direction
                
                // The snake's direction should have changed
                return testSnake.direction === newDirection;
            }
        ), { numRuns: 100 });
    });
    
    /**
     * Feature: snake-game, Property 3: Reverse direction prevention
     * Validates: Requirements 1.3
     */
    test('Property 3: Reverse direction prevention', () => {
        fc.assert(fc.property(
            fc.constantFrom(...Object.values(CONFIG.DIRECTIONS)),
            (direction) => {
                const opposites = {
                    [CONFIG.DIRECTIONS.UP]: CONFIG.DIRECTIONS.DOWN,
                    [CONFIG.DIRECTIONS.DOWN]: CONFIG.DIRECTIONS.UP,
                    [CONFIG.DIRECTIONS.LEFT]: CONFIG.DIRECTIONS.RIGHT,
                    [CONFIG.DIRECTIONS.RIGHT]: CONFIG.DIRECTIONS.LEFT
                };
                
                const testSnake = new Snake(10, 10);
                testSnake.setDirection(direction);
                testSnake.move(); // Apply initial direction
                testSnake.move(); // Move again to ensure the snake has a body trail
                
                const oppositeDirection = opposites[direction];
                testSnake.setDirection(oppositeDirection);
                testSnake.move(); // Try to apply opposite direction
                
                // The snake should still be moving in the original direction
                return testSnake.direction === direction;
            }
        ), { numRuns: 100 });
    });
    
    /**
     * Feature: snake-game, Property 4: Grid-based movement
     * Validates: Requirements 1.4
     */
    test('Property 4: Grid-based movement', () => {
        fc.assert(fc.property(
            fc.constantFrom(...Object.values(CONFIG.DIRECTIONS)),
            fc.integer({ min: 1, max: 10 }),
            (direction, steps) => {
                const testSnake = new Snake(10, 10);
                
                // Set direction and move once to establish the direction
                testSnake.setDirection(direction);
                testSnake.move();
                
                const initialHead = testSnake.getHead();
                
                // Move the snake the specified number of additional steps
                for (let i = 0; i < steps; i++) {
                    testSnake.move();
                }
                
                const finalHead = testSnake.getHead();
                
                // Calculate expected movement based on direction
                const expectedMovement = {
                    [CONFIG.DIRECTIONS.UP]: { x: 0, y: -steps },
                    [CONFIG.DIRECTIONS.DOWN]: { x: 0, y: steps },
                    [CONFIG.DIRECTIONS.LEFT]: { x: -steps, y: 0 },
                    [CONFIG.DIRECTIONS.RIGHT]: { x: steps, y: 0 }
                };
                
                const expected = expectedMovement[direction];
                const actualMovement = {
                    x: finalHead.x - initialHead.x,
                    y: finalHead.y - initialHead.y
                };
                
                // Movement should be exactly one cell per step in the correct direction
                return actualMovement.x === expected.x && actualMovement.y === expected.y;
            }
        ), { numRuns: 100 });
    });
    
    /**
     * Feature: snake-game, Property 6: Snake growth on food consumption
     * Validates: Requirements 2.2
     */
    test('Property 6: Snake growth on food consumption', () => {
        fc.assert(fc.property(
            fc.integer({ min: 1, max: 20 }),
            (growthCount) => {
                const testSnake = new Snake(10, 10);
                const initialLength = testSnake.getLength();
                
                // Grow the snake the specified number of times
                for (let i = 0; i < growthCount; i++) {
                    testSnake.grow();
                }
                
                const finalLength = testSnake.getLength();
                
                // Length should increase by exactly the number of growth calls
                return finalLength === initialLength + growthCount;
            }
        ), { numRuns: 100 });
    });
    
    /**
     * Feature: snake-game, Property 11: Self-collision detection
     * Validates: Requirements 3.2
     */
    test('Property 11: Self-collision detection', () => {
        // Test with a long snake that will definitely cause collision
        const testSnake = new Snake(10, 10);
        
        // Grow the snake to make it long enough (20 segments total)
        for (let i = 0; i < 17; i++) {
            testSnake.grow();
        }
        
        // Create a small square pattern that will cause collision
        testSnake.setDirection(CONFIG.DIRECTIONS.RIGHT);
        testSnake.move();
        testSnake.move();
        
        testSnake.setDirection(CONFIG.DIRECTIONS.DOWN);
        testSnake.move();
        testSnake.move();
        
        testSnake.setDirection(CONFIG.DIRECTIONS.LEFT);
        testSnake.move();
        testSnake.move();
        
        testSnake.setDirection(CONFIG.DIRECTIONS.UP);
        testSnake.move();
        testSnake.move(); // This should cause collision
        
        // Should detect self-collision
        const hasCollision = testSnake.checkSelfCollision();
        assert.strictEqual(hasCollision, true, 'Snake should detect self-collision');
    });
});