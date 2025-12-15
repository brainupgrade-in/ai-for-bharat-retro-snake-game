// Game engine class
import { CONFIG, COLLISION_TYPES } from './config.js';
import { Snake } from './snake.js';
import { Food } from './food.js';

export class Game {
    constructor(canvas) {
        // Canvas and rendering context
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        if (!this.ctx) {
            throw new Error('Could not get canvas 2D context');
        }
        
        // Set up canvas properties
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
        this.ctx.imageSmoothingEnabled = false; // Crisp pixel rendering
        
        // Game state
        this.state = CONFIG.STATES.START;
        
        // Game entities
        this.playerSnake = new Snake();
        this.food = new Food();
        
        // Score tracking
        this.score = 0;
        this.highScore = this.loadHighScore();
        
        // Game timing
        this.gameSpeed = CONFIG.INITIAL_SPEED;
        this.lastUpdate = 0;
        this.lastRender = 0;
        
        // Game loop control
        this.animationId = null;
        this.isRunning = false;
        
        console.log('Game initialized');
        
        // Initialize first food
        this.spawnFood();
    }
    
    /**
     * Start the game
     */
    start() {
        if (this.state === CONFIG.STATES.START) {
            this.state = CONFIG.STATES.PLAYING;
            this.isRunning = true;
            this.lastUpdate = performance.now();
            this.gameLoop();
            console.log('Game started');
        }
    }
    
    /**
     * Pause the game
     */
    pause() {
        if (this.state === CONFIG.STATES.PLAYING) {
            this.state = CONFIG.STATES.PAUSED;
            console.log('Game paused');
        }
    }
    
    /**
     * Resume the game
     */
    resume() {
        if (this.state === CONFIG.STATES.PAUSED) {
            this.state = CONFIG.STATES.PLAYING;
            this.lastUpdate = performance.now(); // Reset timing
            console.log('Game resumed');
        }
    }
    
    /**
     * Reset the game to initial state
     */
    reset() {
        // Reset game state
        this.state = CONFIG.STATES.START;
        this.isRunning = false;
        
        // Cancel animation loop
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Reset entities
        this.playerSnake.reset();
        this.spawnFood();
        
        // Reset score and timing
        this.score = 0;
        this.gameSpeed = CONFIG.INITIAL_SPEED;
        this.lastUpdate = 0;
        
        console.log('Game reset');
    }
    
    /**
     * Main game loop using requestAnimationFrame
     */
    gameLoop(timestamp = performance.now()) {
        if (!this.isRunning) return;
        
        // Update game logic at fixed intervals
        if (timestamp - this.lastUpdate >= this.gameSpeed) {
            this.update();
            this.lastUpdate = timestamp;
        }
        
        // Render at 60 FPS
        this.render();
        
        // Continue the loop
        this.animationId = requestAnimationFrame((ts) => this.gameLoop(ts));
    }
    
    /**
     * Update game logic
     */
    update() {
        if (this.state !== CONFIG.STATES.PLAYING) return;
        
        // Move the snake
        this.playerSnake.move();
        
        // Check collisions
        const collision = this.checkCollisions();
        
        if (collision === COLLISION_TYPES.FOOD) {
            // Snake ate food
            this.handleFoodCollision();
        } else if (collision === COLLISION_TYPES.WALL || collision === COLLISION_TYPES.SELF) {
            // Game over
            this.handleGameOver();
        }
    }
    
    /**
     * Render the game
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines (optional, for debugging)
        if (false) { // Set to true to show grid
            this.drawGrid();
        }
        
        // Draw food
        this.drawFood();
        
        // Draw snake
        this.drawSnake();
    }
    
    /**
     * Check for collisions
     * @returns {string} Collision type
     */
    checkCollisions() {
        const head = this.playerSnake.getHead();
        
        // Check wall collision
        if (head.x < 0 || head.x >= CONFIG.GRID_SIZE ||
            head.y < 0 || head.y >= CONFIG.GRID_SIZE) {
            return COLLISION_TYPES.WALL;
        }
        
        // Check self collision
        if (this.playerSnake.checkSelfCollision()) {
            return COLLISION_TYPES.SELF;
        }
        
        // Check food collision
        if (this.food.isAt(head.x, head.y)) {
            return COLLISION_TYPES.FOOD;
        }
        
        return COLLISION_TYPES.NONE;
    }
    
    /**
     * Handle food collision
     */
    handleFoodCollision() {
        // Grow snake
        this.playerSnake.grow();
        
        // Increase score
        this.score++;
        
        // Spawn new food
        this.spawnFood();
        
        // Increase game speed slightly
        if (this.gameSpeed > CONFIG.MIN_SPEED) {
            this.gameSpeed = Math.max(CONFIG.MIN_SPEED, this.gameSpeed - CONFIG.SPEED_INCREMENT);
        }
        
        console.log('Food eaten! Score:', this.score, 'Speed:', this.gameSpeed);
    }
    
    /**
     * Handle game over
     */
    handleGameOver() {
        this.state = CONFIG.STATES.GAME_OVER;
        this.isRunning = false;
        
        // Update high score if necessary
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            console.log('New high score!', this.highScore);
        }
        
        console.log('Game over! Final score:', this.score);
    }
    
    /**
     * Spawn food at a random location
     */
    spawnFood() {
        const avoidPositions = this.playerSnake.getBodyPositions();
        this.food.spawn(avoidPositions);
    }
    
    /**
     * Draw the snake
     */
    drawSnake() {
        const body = this.playerSnake.getBodyPositions();
        
        body.forEach((segment, index) => {
            const x = segment.x * CONFIG.CELL_SIZE;
            const y = segment.y * CONFIG.CELL_SIZE;
            
            // Use different color for head
            this.ctx.fillStyle = index === 0 ? this.playerSnake.headColor : this.playerSnake.color;
            this.ctx.fillRect(x, y, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
            
            // Add border for better visibility
            this.ctx.strokeStyle = CONFIG.COLORS.BACKGROUND;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
        });
    }
    
    /**
     * Draw the food
     */
    drawFood() {
        const position = this.food.getPosition();
        const x = position.x * CONFIG.CELL_SIZE;
        const y = position.y * CONFIG.CELL_SIZE;
        
        // Draw food as a circle
        this.ctx.fillStyle = this.food.getColor();
        this.ctx.beginPath();
        this.ctx.arc(
            x + CONFIG.CELL_SIZE / 2,
            y + CONFIG.CELL_SIZE / 2,
            CONFIG.CELL_SIZE / 2 - 2,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
    }
    
    /**
     * Draw grid lines (for debugging)
     */
    drawGrid() {
        this.ctx.strokeStyle = CONFIG.COLORS.GRID_LINE;
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= CONFIG.GRID_SIZE; x++) {
            const xPos = x * CONFIG.CELL_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(xPos, 0);
            this.ctx.lineTo(xPos, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= CONFIG.GRID_SIZE; y++) {
            const yPos = y * CONFIG.CELL_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(0, yPos);
            this.ctx.lineTo(this.canvas.width, yPos);
            this.ctx.stroke();
        }
    }
    
    /**
     * Set snake direction
     * @param {string} direction - New direction
     */
    setDirection(direction) {
        this.playerSnake.setDirection(direction);
    }
    
    /**
     * Get current game state
     * @returns {string} Current state
     */
    getState() {
        return this.state;
    }
    
    /**
     * Get current score
     * @returns {number} Current score
     */
    getScore() {
        return this.score;
    }
    
    /**
     * Get high score
     * @returns {number} High score
     */
    getHighScore() {
        return this.highScore;
    }
    
    /**
     * Load high score from localStorage
     * @returns {number} Saved high score or 0
     */
    loadHighScore() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE.HIGH_SCORE);
            return saved ? parseInt(saved, 10) : 0;
        } catch (error) {
            console.warn('Could not load high score:', error);
            return 0;
        }
    }
    
    /**
     * Save high score to localStorage
     */
    saveHighScore() {
        try {
            localStorage.setItem(CONFIG.STORAGE.HIGH_SCORE, this.highScore.toString());
        } catch (error) {
            console.warn('Could not save high score:', error);
        }
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        console.log('Game destroyed');
    }
}