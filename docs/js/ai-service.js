// AI Service for Amazon Bedrock integration and fallback logic
import { CONFIG } from './config.js';

export class AIService {
    constructor() {
        // Bedrock client (will be initialized when credentials are provided)
        this.client = null;
        this.enabled = false;
        
        // Configuration
        this.model = 'anthropic.claude-3-haiku-20240307-v1:0';
        this.maxTokens = 10;
        this.timeout = 500; // 500ms max response time
        
        // Fallback and caching
        this.fallbackEnabled = true;
        this.lastMove = null;
        this.lastMoveTime = 0;
        this.pendingRequest = null;
        
        // Difficulty settings
        this.difficulty = 'medium';
        this.difficultySettings = {
            easy: {
                temperature: 0.7,
                mistakeRate: 0.2,
                aggression: 0.3
            },
            medium: {
                temperature: 0.3,
                mistakeRate: 0.05,
                aggression: 0.5
            },
            hard: {
                temperature: 0.1,
                mistakeRate: 0.0,
                aggression: 0.8
            }
        };
        
        console.log('AIService initialized');
    }
    
    /**
     * Initialize Bedrock client with AWS credentials
     * @param {Object} credentials - AWS credentials
     */
    async initialize(credentials = null) {
        try {
            if (credentials && typeof window !== 'undefined' && window.AWS) {
                // Configure AWS SDK
                window.AWS.config.update({
                    region: credentials.region || 'us-east-1',
                    accessKeyId: credentials.accessKeyId,
                    secretAccessKey: credentials.secretAccessKey,
                    sessionToken: credentials.sessionToken
                });
                
                // Initialize Bedrock Runtime client
                this.client = new window.AWS.BedrockRuntime({
                    region: credentials.region || 'us-east-1'
                });
                
                this.enabled = true;
                console.log('Bedrock client initialized successfully');
            } else {
                console.log('No credentials provided, using fallback AI only');
                this.enabled = false;
            }
        } catch (error) {
            console.warn('Failed to initialize Bedrock client:', error);
            this.enabled = false;
        }
    }
    
    /**
     * Get AI move decision
     * @param {Object} gameState - Current game state
     * @returns {Promise<string>} Direction (UP, DOWN, LEFT, RIGHT)
     */
    async getAIMove(gameState, difficultyParams = null) {
        // Check if we have a recent cached move (within 150ms)
        const now = performance.now();
        if (this.lastMove && (now - this.lastMoveTime) < 150) {
            return this.lastMove;
        }
        
        let move = null;
        
        // Try Bedrock API if enabled
        if (this.enabled && this.client) {
            try {
                move = await this.getBedrockMove(gameState);
            } catch (error) {
                console.warn('Bedrock API failed, using fallback:', error);
                move = null;
            }
        }
        
        // Use fallback if Bedrock failed or not available
        if (!move && this.fallbackEnabled) {
            move = this.getLocalAIMove(gameState);
        }
        
        // Apply difficulty-based mistakes
        if (move) {
            const mistakeRate = difficultyParams ? difficultyParams.mistakeRate : this.difficultySettings[this.difficulty].mistakeRate;
            move = this.applyMistake(move, gameState, mistakeRate);
            this.lastMove = move;
            this.lastMoveTime = now;
        }
        
        return move || this.getSafeRandomMove(gameState);
    }
    
    /**
     * Get move from Bedrock API
     * @param {Object} gameState - Current game state
     * @returns {Promise<string>} Direction
     */
    async getBedrockMove(gameState) {
        const prompt = this.buildPrompt(gameState);
        const settings = this.difficultySettings[this.difficulty];
        
        const requestBody = {
            anthropic_version: 'bedrock-2023-05-31',
            max_tokens: this.maxTokens,
            temperature: settings.temperature,
            messages: [{
                role: 'user',
                content: prompt
            }]
        };
        
        const params = {
            modelId: this.model,
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify(requestBody)
        };
        
        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), this.timeout);
        });
        
        // Race between API call and timeout
        const response = await Promise.race([
            this.client.invokeModel(params).promise(),
            timeoutPromise
        ]);
        
        const responseBody = JSON.parse(response.body.toString());
        return this.parseResponse(responseBody);
    }
    
    /**
     * Build prompt for Bedrock API
     * @param {Object} gameState - Current game state
     * @returns {string} Formatted prompt
     */
    buildPrompt(gameState) {
        const { aiSnake, playerSnake, food, gridSize } = gameState;
        const aiHead = aiSnake.body[0];
        const playerHead = playerSnake.body[0];
        
        return `You are playing Snake. Grid is ${gridSize}x${gridSize} (0-${gridSize-1} valid).

Your head: (${aiHead.x}, ${aiHead.y})
Your body: [${aiSnake.body.map(seg => `(${seg.x},${seg.y})`).join(', ')}]
Current direction: ${aiSnake.direction}
Food at: (${food.x}, ${food.y})
Enemy head: (${playerHead.x}, ${playerHead.y})
Enemy body: [${playerSnake.body.map(seg => `(${seg.x},${seg.y})`).join(', ')}]

Rules:
- Cannot reverse direction
- Must avoid walls (x<0, x>${gridSize-1}, y<0, y>${gridSize-1})
- Must avoid your body
- Should avoid enemy snake
- Goal: reach food before enemy

Reply with exactly one word: UP, DOWN, LEFT, or RIGHT`;
    }
    
    /**
     * Parse Bedrock API response
     * @param {Object} response - API response
     * @returns {string|null} Direction or null if invalid
     */
    parseResponse(response) {
        try {
            const text = response.content[0].text.trim().toUpperCase();
            const validMoves = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
            
            // Direct match
            if (validMoves.includes(text)) {
                return text;
            }
            
            // Extract from longer response
            for (const move of validMoves) {
                if (text.includes(move)) {
                    return move;
                }
            }
            
            return null;
        } catch (error) {
            console.warn('Failed to parse Bedrock response:', error);
            return null;
        }
    }
    
    /**
     * Get local AI move using simple pathfinding
     * @param {Object} gameState - Current game state
     * @returns {string} Direction
     */
    getLocalAIMove(gameState) {
        const { aiSnake, playerSnake, food, gridSize } = gameState;
        const head = aiSnake.body[0];
        const currentDir = aiSnake.direction;
        
        // Get all possible moves
        const possibleMoves = this.getPossibleMoves(head, currentDir, gameState);
        
        if (possibleMoves.length === 0) {
            return this.getSafeRandomMove(gameState);
        }
        
        // Score each move
        const scoredMoves = possibleMoves.map(move => ({
            direction: move,
            score: this.scoreMove(head, move, gameState)
        }));
        
        // Sort by score (highest first)
        scoredMoves.sort((a, b) => b.score - a.score);
        
        return scoredMoves[0].direction;
    }
    
    /**
     * Get possible moves (avoiding immediate death)
     * @param {Object} head - Current head position
     * @param {string} currentDir - Current direction
     * @param {Object} gameState - Game state
     * @returns {Array<string>} Valid directions
     */
    getPossibleMoves(head, currentDir, gameState) {
        const { aiSnake, playerSnake, gridSize } = gameState;
        const moves = [];
        
        const directions = [
            { dir: 'UP', dx: 0, dy: -1 },
            { dir: 'DOWN', dx: 0, dy: 1 },
            { dir: 'LEFT', dx: -1, dy: 0 },
            { dir: 'RIGHT', dx: 1, dy: 0 }
        ];
        
        // Reverse direction mapping
        const opposite = {
            'UP': 'DOWN',
            'DOWN': 'UP',
            'LEFT': 'RIGHT',
            'RIGHT': 'LEFT'
        };
        
        for (const { dir, dx, dy } of directions) {
            // Can't reverse direction
            if (dir === opposite[currentDir]) continue;
            
            const newPos = { x: head.x + dx, y: head.y + dy };
            
            // Check bounds
            if (newPos.x < 0 || newPos.x >= gridSize || 
                newPos.y < 0 || newPos.y >= gridSize) continue;
            
            // Check self collision
            if (this.wouldCollideWithSnake(newPos, aiSnake.body)) continue;
            
            // Check player collision
            if (this.wouldCollideWithSnake(newPos, playerSnake.body)) continue;
            
            moves.push(dir);
        }
        
        return moves;
    }
    
    /**
     * Score a potential move
     * @param {Object} head - Current head position
     * @param {string} direction - Direction to move
     * @param {Object} gameState - Game state
     * @returns {number} Move score
     */
    scoreMove(head, direction, gameState) {
        const { food, playerSnake } = gameState;
        const dirMap = {
            'UP': { dx: 0, dy: -1 },
            'DOWN': { dx: 0, dy: 1 },
            'LEFT': { dx: -1, dy: 0 },
            'RIGHT': { dx: 1, dy: 0 }
        };
        
        const { dx, dy } = dirMap[direction];
        const newPos = { x: head.x + dx, y: head.y + dy };
        
        let score = 0;
        
        // Distance to food (closer is better)
        const foodDistance = Math.abs(newPos.x - food.x) + Math.abs(newPos.y - food.y);
        score += 100 - foodDistance;
        
        // Distance to player head (farther is better for safety)
        const playerHead = playerSnake.body[0];
        const playerDistance = Math.abs(newPos.x - playerHead.x) + Math.abs(newPos.y - playerHead.y);
        score += playerDistance * 2;
        
        // Prefer center of board (more options)
        const centerDistance = Math.abs(newPos.x - 10) + Math.abs(newPos.y - 10);
        score += 20 - centerDistance;
        
        return score;
    }
    
    /**
     * Check if position would collide with snake body
     * @param {Object} pos - Position to check
     * @param {Array} body - Snake body segments
     * @returns {boolean} True if collision
     */
    wouldCollideWithSnake(pos, body) {
        return body.some(segment => segment.x === pos.x && segment.y === pos.y);
    }
    
    /**
     * Apply difficulty-based mistakes
     * @param {string} optimalMove - The optimal move
     * @param {Object} gameState - Game state
     * @returns {string} Final move (possibly with mistake)
     */
    applyMistake(optimalMove, gameState, mistakeRate = null) {
        const actualMistakeRate = mistakeRate !== null ? mistakeRate : this.difficultySettings[this.difficulty].mistakeRate;
        
        if (Math.random() < actualMistakeRate) {
            const possibleMoves = this.getPossibleMoves(
                gameState.aiSnake.body[0], 
                gameState.aiSnake.direction, 
                gameState
            );
            
            // Remove optimal move from options
            const alternatives = possibleMoves.filter(move => move !== optimalMove);
            
            if (alternatives.length > 0) {
                return alternatives[Math.floor(Math.random() * alternatives.length)];
            }
        }
        
        return optimalMove;
    }
    
    /**
     * Get a safe random move when all else fails
     * @param {Object} gameState - Game state
     * @returns {string} Direction
     */
    getSafeRandomMove(gameState) {
        const possibleMoves = this.getPossibleMoves(
            gameState.aiSnake.body[0],
            gameState.aiSnake.direction,
            gameState
        );
        
        if (possibleMoves.length > 0) {
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
        
        // Last resort - return current direction (will likely cause collision)
        return gameState.aiSnake.direction;
    }
    
    /**
     * Set AI difficulty level
     * @param {string} level - easy, medium, or hard
     */
    setDifficulty(level) {
        if (this.difficultySettings[level]) {
            this.difficulty = level;
            console.log(`AI difficulty set to: ${level}`);
        }
    }
    
    /**
     * Get current difficulty level
     * @returns {string} Current difficulty
     */
    getDifficulty() {
        return this.difficulty;
    }
    
    /**
     * Enable/disable AI service
     * @param {boolean} enabled - Whether to enable AI
     */
    setEnabled(enabled) {
        this.enabled = enabled && this.client !== null;
        console.log(`AI service ${this.enabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Check if AI service is available
     * @returns {boolean} True if AI can make moves
     */
    isAvailable() {
        return this.enabled || this.fallbackEnabled;
    }
}