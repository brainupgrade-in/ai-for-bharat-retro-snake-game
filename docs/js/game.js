// Game engine class
import { CONFIG, COLLISION_TYPES } from './config.js';
import { Snake } from './snake.js';
import { Food } from './food.js';
import { AIService } from './ai-service.js';

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
        this.aiSnake = new Snake(
            CONFIG.AI_SNAKE.INITIAL_X,
            CONFIG.AI_SNAKE.INITIAL_Y,
            CONFIG.AI_SNAKE.INITIAL_DIRECTION,
            CONFIG.COLORS.AI_SNAKE_BODY,
            CONFIG.COLORS.AI_SNAKE_HEAD
        );
        this.food = new Food();
        
        // AI service
        this.aiService = new AIService();
        this.aiEnabled = this.loadSettings().aiEnabled || false;
        
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
        this.aiSnake.reset();
        this.aiSnake.alive = true; // Ensure AI snake is alive for next game
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
    async update() {
        if (this.state !== CONFIG.STATES.PLAYING) return;
        
        // Move the player snake
        this.playerSnake.move();
        
        // Move the AI snake if enabled
        if (this.aiEnabled && this.aiSnake.alive) {
            await this.updateAISnake();
        }
        
        // Check collisions for both snakes
        const playerCollision = this.checkPlayerCollisions();
        const aiCollision = this.aiEnabled ? this.checkAICollisions() : COLLISION_TYPES.NONE;
        
        // Handle player collisions
        if (playerCollision === COLLISION_TYPES.FOOD) {
            this.handlePlayerFoodCollision();
        } else if (playerCollision === COLLISION_TYPES.WALL || 
                   playerCollision === COLLISION_TYPES.SELF ||
                   playerCollision === COLLISION_TYPES.AI_SNAKE) {
            this.handlePlayerGameOver();
        }
        
        // Handle AI collisions
        if (this.aiEnabled && aiCollision === COLLISION_TYPES.FOOD) {
            this.handleAIFoodCollision();
        } else if (this.aiEnabled && (aiCollision === COLLISION_TYPES.WALL || 
                                     aiCollision === COLLISION_TYPES.SELF ||
                                     aiCollision === COLLISION_TYPES.PLAYER_SNAKE)) {
            this.handleAIGameOver();
        }
        
        // Check for head-to-head collision
        if (this.aiEnabled && this.checkHeadToHeadCollision()) {
            this.handleDrawGame();
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
        
        // Draw player snake
        this.drawSnake(this.playerSnake);
        
        // Draw AI snake if enabled
        if (this.aiEnabled && this.aiSnake.alive) {
            this.drawSnake(this.aiSnake);
        }
    }
    
    /**
     * Check player snake collisions
     * @returns {string} Collision type
     */
    checkPlayerCollisions() {
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
        
        // Check AI snake collision (if enabled and alive)
        if (this.aiEnabled && this.aiSnake.alive) {
            if (this.checkSnakeCollision(head, this.aiSnake.body)) {
                return COLLISION_TYPES.AI_SNAKE;
            }
        }
        
        // Check food collision
        if (this.food.isAt(head.x, head.y)) {
            return COLLISION_TYPES.FOOD;
        }
        
        return COLLISION_TYPES.NONE;
    }
    
    /**
     * Check AI snake collisions
     * @returns {string} Collision type
     */
    checkAICollisions() {
        if (!this.aiEnabled || !this.aiSnake.alive) return COLLISION_TYPES.NONE;
        
        const head = this.aiSnake.getHead();
        
        // Check wall collision
        if (head.x < 0 || head.x >= CONFIG.GRID_SIZE ||
            head.y < 0 || head.y >= CONFIG.GRID_SIZE) {
            return COLLISION_TYPES.WALL;
        }
        
        // Check self collision
        if (this.aiSnake.checkSelfCollision()) {
            return COLLISION_TYPES.SELF;
        }
        
        // Check player snake collision
        if (this.checkSnakeCollision(head, this.playerSnake.body)) {
            return COLLISION_TYPES.PLAYER_SNAKE;
        }
        
        // Check food collision
        if (this.food.isAt(head.x, head.y)) {
            return COLLISION_TYPES.FOOD;
        }
        
        return COLLISION_TYPES.NONE;
    }
    
    /**
     * Check if position collides with snake body
     * @param {Object} pos - Position to check
     * @param {Array} body - Snake body segments
     * @returns {boolean} True if collision
     */
    checkSnakeCollision(pos, body) {
        return body.some(segment => segment.x === pos.x && segment.y === pos.y);
    }
    
    /**
     * Check for head-to-head collision
     * @returns {boolean} True if heads collide
     */
    checkHeadToHeadCollision() {
        if (!this.aiEnabled || !this.aiSnake.alive) return false;
        
        const playerHead = this.playerSnake.getHead();
        const aiHead = this.aiSnake.getHead();
        
        return playerHead.x === aiHead.x && playerHead.y === aiHead.y;
    }
    
    /**
     * Update AI snake movement
     */
    async updateAISnake() {
        try {
            // Build game state for AI
            const gameState = {
                aiSnake: {
                    body: this.aiSnake.body,
                    direction: this.aiSnake.direction
                },
                playerSnake: {
                    body: this.playerSnake.body,
                    direction: this.playerSnake.direction
                },
                food: this.food.getPosition(),
                gridSize: CONFIG.GRID_SIZE
            };
            
            // Get AI move decision
            const aiMove = await this.aiService.getAIMove(gameState);
            
            if (aiMove) {
                // Set AI snake direction
                this.aiSnake.setDirection(aiMove);
            }
            
            // Move AI snake
            this.aiSnake.move();
            
        } catch (error) {
            console.warn('AI update failed:', error);
            // AI snake continues with current direction
            this.aiSnake.move();
        }
    }
    
    /**
     * Handle player food collision
     */
    handlePlayerFoodCollision() {
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
        
        console.log('Player ate food! Score:', this.score, 'Speed:', this.gameSpeed);
    }
    
    /**
     * Handle AI food collision
     */
    handleAIFoodCollision() {
        // Grow AI snake
        this.aiSnake.grow();
        
        // Spawn new food
        this.spawnFood();
        
        console.log('AI ate food! AI snake grew.');
    }
    
    /**
     * Handle player game over
     */
    handlePlayerGameOver() {
        this.state = CONFIG.STATES.GAME_OVER;
        this.isRunning = false;
        
        // Update high score if necessary
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            console.log('New high score!', this.highScore);
        }
        
        console.log('Player game over! Final score:', this.score);
    }
    
    /**
     * Handle AI game over (AI loses, player continues)
     */
    handleAIGameOver() {
        this.aiSnake.alive = false;
        console.log('AI snake died! Player continues alone.');
    }
    
    /**
     * Handle draw game (both snakes collide head-to-head)
     */
    handleDrawGame() {
        this.state = CONFIG.STATES.GAME_OVER;
        this.isRunning = false;
        
        // Update high score if necessary
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            console.log('New high score!', this.highScore);
        }
        
        console.log('Draw game! Both snakes collided head-to-head.');
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
        const avoidPositions = [...this.playerSnake.getBodyPositions()];
        
        // Also avoid AI snake positions if enabled and alive
        if (this.aiEnabled && this.aiSnake.alive) {
            avoidPositions.push(...this.aiSnake.getBodyPositions());
        }
        
        this.food.spawn(avoidPositions);
    }
    
    /**
     * Draw a snake
     * @param {Snake} snake - Snake to draw
     */
    drawSnake(snake) {
        const body = snake.getBodyPositions();
        
        body.forEach((segment, index) => {
            const x = segment.x * CONFIG.CELL_SIZE;
            const y = segment.y * CONFIG.CELL_SIZE;
            
            // Use different color for head
            this.ctx.fillStyle = index === 0 ? snake.headColor : snake.color;
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
     * Load settings from localStorage
     * @returns {Object} Settings object
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE.SETTINGS);
            return saved ? JSON.parse(saved) : CONFIG.DEFAULT_SETTINGS;
        } catch (error) {
            console.warn('Could not load settings:', error);
            return CONFIG.DEFAULT_SETTINGS;
        }
    }
    
    /**
     * Save settings to localStorage
     * @param {Object} settings - Settings to save
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(CONFIG.STORAGE.SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.warn('Could not save settings:', error);
        }
    }
    
    /**
     * Enable/disable AI opponent
     * @param {boolean} enabled - Whether to enable AI
     */
    setAIEnabled(enabled) {
        this.aiEnabled = enabled;
        
        // Save setting
        const settings = this.loadSettings();
        settings.aiEnabled = enabled;
        this.saveSettings(settings);
        
        console.log(`AI opponent ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Get AI enabled status
     * @returns {boolean} True if AI is enabled
     */
    isAIEnabled() {
        return this.aiEnabled;
    }
    
    /**
     * Set AI difficulty
     * @param {string} difficulty - easy, medium, or hard
     */
    setAIDifficulty(difficulty) {
        this.aiService.setDifficulty(difficulty);
        
        // Save setting
        const settings = this.loadSettings();
        settings.aiDifficulty = difficulty;
        this.saveSettings(settings);
        
        console.log(`AI difficulty set to: ${difficulty}`);
    }
    
    /**
     * Get AI difficulty
     * @returns {string} Current AI difficulty
     */
    getAIDifficulty() {
        return this.aiService.getDifficulty();
    }
    
    /**
     * Initialize AI service with credentials
     * @param {Object} credentials - AWS credentials
     */
    async initializeAI(credentials) {
        await this.aiService.initialize(credentials);
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