// Snake entity class
import { CONFIG, DIRECTION_VECTORS, OPPOSITE_DIRECTIONS } from './config.js';

export class Snake {
    constructor(
        startX = CONFIG.SNAKE.INITIAL_X, 
        startY = CONFIG.SNAKE.INITIAL_Y, 
        initialDirection = CONFIG.SNAKE.INITIAL_DIRECTION,
        bodyColor = CONFIG.COLORS.SNAKE_BODY,
        headColor = CONFIG.COLORS.SNAKE_HEAD
    ) {
        // Initialize snake body as array of positions
        this.body = [];
        
        // Calculate body positions based on initial direction
        const dirVector = DIRECTION_VECTORS[initialDirection];
        for (let i = 0; i < CONFIG.SNAKE.INITIAL_LENGTH; i++) {
            this.body.push({
                x: startX - (dirVector.x * i),
                y: startY - (dirVector.y * i)
            });
        }
        
        // Set initial direction
        this.direction = initialDirection;
        this.nextDirection = this.direction; // Queue for next direction change
        
        // Visual properties
        this.color = bodyColor;
        this.headColor = headColor;
        
        // State
        this.alive = true;
        this.hasMoved = false; // Track if snake has moved at least once
        
        console.log('Snake created at', startX, startY, 'with length', this.body.length);
    }
    
    /**
     * Move the snake one step in the current direction
     */
    move() {
        if (!this.alive) return;
        
        // Update direction from queue
        this.direction = this.nextDirection;
        
        // Get direction vector
        const vector = DIRECTION_VECTORS[this.direction];
        if (!vector) {
            console.error('Invalid direction:', this.direction);
            return;
        }
        
        // Calculate new head position
        const head = this.getHead();
        const newHead = {
            x: head.x + vector.x,
            y: head.y + vector.y
        };
        
        // Add new head to front of body
        this.body.unshift(newHead);
        
        // Remove tail (will be added back if food is eaten)
        this.body.pop();
        
        // Mark that the snake has moved
        this.hasMoved = true;
    }
    
    /**
     * Grow the snake by one segment
     */
    grow() {
        if (!this.alive) return;
        
        // Get the current tail position
        const tail = this.body[this.body.length - 1];
        
        // Add a new segment at the tail position
        this.body.push({ x: tail.x, y: tail.y });
        
        console.log('Snake grew to length', this.body.length);
    }
    
    /**
     * Set the snake's direction, preventing reverse moves
     * @param {string} newDirection - The new direction to set
     */
    setDirection(newDirection) {
        if (!this.alive) return;
        
        // Validate direction
        if (!Object.values(CONFIG.DIRECTIONS).includes(newDirection)) {
            console.warn('Invalid direction:', newDirection);
            return;
        }
        
        // Prevent reverse direction (can't go directly opposite)
        // But only if the snake has actually moved at least once
        if (this.hasMoved) {
            const oppositeDirection = OPPOSITE_DIRECTIONS[this.direction];
            if (newDirection === oppositeDirection) {
                console.log('Reverse direction blocked:', newDirection);
                return;
            }
        }
        
        // Queue the direction change for next move
        this.nextDirection = newDirection;
        console.log('Direction queued:', newDirection);
    }
    
    /**
     * Check if the snake has collided with itself
     * @returns {boolean} True if self-collision detected
     */
    checkSelfCollision() {
        if (!this.alive || this.body.length < 2) return false;
        
        const head = this.getHead();
        
        // Check if head position matches any body segment (excluding head itself)
        for (let i = 1; i < this.body.length; i++) {
            const segment = this.body[i];
            if (head.x === segment.x && head.y === segment.y) {
                console.log('Self collision detected at', head.x, head.y, 'with segment at index', i);
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Get the head position of the snake
     * @returns {{x: number, y: number}} Head position
     */
    getHead() {
        return this.body[0];
    }
    
    /**
     * Get the tail position of the snake
     * @returns {{x: number, y: number}} Tail position
     */
    getTail() {
        return this.body[this.body.length - 1];
    }
    
    /**
     * Get all body positions (useful for collision detection)
     * @returns {Array<{x: number, y: number}>} Array of all body positions
     */
    getBodyPositions() {
        return [...this.body]; // Return a copy to prevent external modification
    }
    
    /**
     * Check if a position overlaps with any part of the snake
     * @param {number} x - X coordinate to check
     * @param {number} y - Y coordinate to check
     * @returns {boolean} True if position overlaps with snake
     */
    occupiesPosition(x, y) {
        return this.body.some(segment => segment.x === x && segment.y === y);
    }
    
    /**
     * Kill the snake (used when collision occurs)
     */
    kill() {
        this.alive = false;
        console.log('Snake died');
    }
    
    /**
     * Reset the snake to initial state
     */
    reset() {
        // Reset body to initial length and position
        this.body = [];
        for (let i = 0; i < CONFIG.SNAKE.INITIAL_LENGTH; i++) {
            this.body.push({
                x: CONFIG.SNAKE.INITIAL_X - i,
                y: CONFIG.SNAKE.INITIAL_Y
            });
        }
        
        // Reset direction
        this.direction = CONFIG.SNAKE.INITIAL_DIRECTION;
        this.nextDirection = this.direction;
        
        // Reset state
        this.alive = true;
        this.hasMoved = false;
        
        console.log('Snake reset');
    }
    
    /**
     * Get the length of the snake
     * @returns {number} Snake length
     */
    getLength() {
        return this.body.length;
    }
}