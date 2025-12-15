// Property-based tests for Food class
import { describe, test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { Food } from './food.js';
import { CONFIG } from './config.js';

describe('Food Property Tests', () => {
    
    /**
     * Feature: snake-game, Property 5: Food visual representation
     * Validates: Requirements 2.1
     */
    test('Property 5: Food visual representation', () => {
        fc.assert(fc.property(
            fc.integer({ min: 0, max: CONFIG.GRID_SIZE - 1 }),
            fc.integer({ min: 0, max: CONFIG.GRID_SIZE - 1 }),
            (x, y) => {
                const food = new Food();
                food.setPosition(x, y);
                
                // Food should have a distinct color (red)
                const color = food.getColor();
                const hasDistinctColor = color === CONFIG.COLORS.FOOD;
                
                // Food should be positioned correctly
                const position = food.getPosition();
                const isPositionedCorrectly = position.x === x && position.y === y;
                
                return hasDistinctColor && isPositionedCorrectly;
            }
        ), { numRuns: 100 });
    });
    
    /**
     * Feature: snake-game, Property 7: Food respawning
     * Validates: Requirements 2.3
     */
    test('Property 7: Food respawning', () => {
        fc.assert(fc.property(
            fc.array(fc.record({
                x: fc.integer({ min: 0, max: CONFIG.GRID_SIZE - 1 }),
                y: fc.integer({ min: 0, max: CONFIG.GRID_SIZE - 1 })
            }), { minLength: 0, maxLength: 10 }),
            (avoidPositions) => {
                const food = new Food();
                
                // Spawn food avoiding the given positions
                food.spawn(avoidPositions);
                
                // Food should have a valid position after spawning
                const position = food.getPosition();
                const isValidPosition = position.x >= 0 && position.x < CONFIG.GRID_SIZE &&
                                      position.y >= 0 && position.y < CONFIG.GRID_SIZE;
                
                return isValidPosition;
            }
        ), { numRuns: 100 });
    });
    
    /**
     * Feature: snake-game, Property 8: Food spawn collision avoidance
     * Validates: Requirements 2.4
     */
    test('Property 8: Food spawn collision avoidance', () => {
        fc.assert(fc.property(
            fc.array(fc.record({
                x: fc.integer({ min: 0, max: CONFIG.GRID_SIZE - 1 }),
                y: fc.integer({ min: 0, max: CONFIG.GRID_SIZE - 1 })
            }), { minLength: 1, maxLength: Math.min(10, CONFIG.GRID_SIZE * CONFIG.GRID_SIZE - 1) }),
            (avoidPositions) => {
                // Skip if avoid positions cover the entire grid (impossible to place food)
                if (avoidPositions.length >= CONFIG.GRID_SIZE * CONFIG.GRID_SIZE) {
                    return true;
                }
                
                const food = new Food();
                
                // Spawn food avoiding the given positions
                food.spawn(avoidPositions);
                
                // Food should not be at any of the avoid positions
                const position = food.getPosition();
                const isNotInAvoidPositions = !avoidPositions.some(avoidPos =>
                    avoidPos.x === position.x && avoidPos.y === position.y
                );
                
                return isNotInAvoidPositions;
            }
        ), { numRuns: 50 }); // Fewer runs since this test is more complex
    });
});