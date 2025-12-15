// Food entity class
import { CONFIG } from './config.js';

export class Food {
    constructor() {
        // Initialize food position (will be set when spawned)
        this.position = { x: 0, y: 0 };
        
        // Visual properties
        this.color = CONFIG.COLORS.FOOD;
        
        console.log('Food entity created');
    }
    
    /**
     * Spawn food at a random position, avoiding occupied positions
     * @param {Array<{x: number, y: number}>} avoidPositions - Positions to avoid (snake body)
     */
    spawn(avoidPositions = []) {
        let attempts = 0;
        const maxAttempts = 100; // Prevent infinite loop
        
        do {
            // Generate random position within grid bounds
            this.position = {
                x: Math.floor(Math.random() * CONFIG.GRID_SIZE),
                y: Math.floor(Math.random() * CONFIG.GRID_SIZE)
            };
            
            attempts++;
            
            // Check if position is valid (not occupied)
            if (!this.isPositionOccupied(this.position, avoidPositions)) {
                console.log('Food spawned at', this.position.x, this.position.y);
                return;
            }
            
        } while (attempts < maxAttempts);
        
        // If we couldn't find a free position after max attempts,
        // just place it at the generated position (this should be very rare)
        console.warn('Could not find free position for food after', maxAttempts, 'attempts. Placing at', this.position.x, this.position.y);
    }
    
    /**
     * Check if a position is occupied by any of the avoid positions
     * @param {{x: number, y: number}} position - Position to check
     * @param {Array<{x: number, y: number}>} avoidPositions - Positions to avoid
     * @returns {boolean} True if position is occupied
     */
    isPositionOccupied(position, avoidPositions) {
        return avoidPositions.some(avoidPos => 
            avoidPos.x === position.x && avoidPos.y === position.y
        );
    }
    
    /**
     * Get the current food position
     * @returns {{x: number, y: number}} Current food position
     */
    getPosition() {
        return { ...this.position }; // Return a copy to prevent external modification
    }
    
    /**
     * Check if a position matches the food position
     * @param {number} x - X coordinate to check
     * @param {number} y - Y coordinate to check
     * @returns {boolean} True if position matches food position
     */
    isAt(x, y) {
        return this.position.x === x && this.position.y === y;
    }
    
    /**
     * Get the food's color
     * @returns {string} Food color
     */
    getColor() {
        return this.color;
    }
    
    /**
     * Set a specific position for the food (useful for testing)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    setPosition(x, y) {
        if (x >= 0 && x < CONFIG.GRID_SIZE && y >= 0 && y < CONFIG.GRID_SIZE) {
            this.position = { x, y };
            console.log('Food position set to', x, y);
        } else {
            console.warn('Invalid food position:', x, y);
        }
    }
    
    /**
     * Generate a random position within grid bounds
     * @returns {{x: number, y: number}} Random position
     */
    static generateRandomPosition() {
        return {
            x: Math.floor(Math.random() * CONFIG.GRID_SIZE),
            y: Math.floor(Math.random() * CONFIG.GRID_SIZE)
        };
    }
    
    /**
     * Check if a position is within grid bounds
     * @param {{x: number, y: number}} position - Position to check
     * @returns {boolean} True if position is within bounds
     */
    static isValidPosition(position) {
        return position.x >= 0 && position.x < CONFIG.GRID_SIZE &&
               position.y >= 0 && position.y < CONFIG.GRID_SIZE;
    }
}