// AI Service for Amazon Bedrock integration and fallback logic
import { CONFIG } from './config.js';

export class AIService {
    constructor() {
        // Bedrock credentials (will be set when credentials are provided)
        this.credentials = null;
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
                // Store credentials for manual API calls
                this.credentials = {
                    region: credentials.region || 'ap-south-1',
                    accessKeyId: credentials.accessKeyId,
                    secretAccessKey: credentials.secretAccessKey,
                    sessionToken: credentials.sessionToken
                };
                
                // Configure AWS SDK for other services
                window.AWS.config.update({
                    region: this.credentials.region,
                    accessKeyId: this.credentials.accessKeyId,
                    secretAccessKey: this.credentials.secretAccessKey,
                    sessionToken: this.credentials.sessionToken
                });
                
                this.enabled = true;
                console.log('AWS credentials configured successfully - Bedrock API ready!');
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
        if (this.enabled && this.credentials) {
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
        
        // Make direct HTTP call to Bedrock API
        const response = await this.callBedrockAPI(requestBody);
        return this.parseResponse(response);
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
        this.enabled = enabled && this.credentials !== null;
        console.log(`AI service ${this.enabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Check if AI service is available
     * @returns {boolean} True if AI can make moves
     */
    isAvailable() {
        return this.enabled || this.fallbackEnabled;
    }

    /**
     * Make direct HTTP call to Bedrock API
     * @param {Object} requestBody - Request payload
     * @returns {Promise<Object>} API response
     */
    async callBedrockAPI(requestBody) {
        const modelId = 'anthropic.claude-3-haiku-20240307-v1:0';
        const region = this.credentials.region;
        const service = 'bedrock';
        const host = `bedrock-runtime.${region}.amazonaws.com`;
        const endpoint = `https://${host}/model/${modelId}/invoke`;
        
        const body = JSON.stringify(requestBody);
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Host': host
        };
        
        // Sign the request
        const signedHeaders = await this.signRequest('POST', endpoint, headers, body);
        
        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Bedrock API timeout')), this.timeout);
        });
        
        // Make the HTTP request
        const fetchPromise = fetch(endpoint, {
            method: 'POST',
            headers: signedHeaders,
            body: body
        }).then(async (response) => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Bedrock API error: ${response.status} ${errorText}`);
            }
            return response.json();
        });
        
        // Race between API call and timeout
        return Promise.race([fetchPromise, timeoutPromise]);
    }

    /**
     * Sign AWS request using Signature Version 4
     * @param {string} method - HTTP method
     * @param {string} url - Full URL
     * @param {Object} headers - Request headers
     * @param {string} body - Request body
     * @returns {Promise<Object>} Signed headers
     */
    async signRequest(method, url, headers, body) {
        const urlObj = new URL(url);
        const host = urlObj.host;
        const pathname = urlObj.pathname;
        const search = urlObj.search;
        
        const region = this.credentials.region;
        const service = 'bedrock';
        const accessKeyId = this.credentials.accessKeyId;
        const secretAccessKey = this.credentials.secretAccessKey;
        const sessionToken = this.credentials.sessionToken;
        
        // Create timestamp
        const now = new Date();
        const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, '');
        const dateStamp = amzDate.substr(0, 8);
        
        // Create canonical request
        const canonicalHeaders = Object.keys(headers)
            .sort()
            .map(key => `${key.toLowerCase()}:${headers[key]}`)
            .join('\n') + '\n';
        
        const signedHeaders = Object.keys(headers)
            .sort()
            .map(key => key.toLowerCase())
            .join(';');
        
        const payloadHash = await this.sha256(body);
        
        const canonicalRequest = [
            method,
            pathname,
            search.slice(1), // Remove leading ?
            canonicalHeaders,
            signedHeaders,
            payloadHash
        ].join('\n');
        
        // Create string to sign
        const algorithm = 'AWS4-HMAC-SHA256';
        const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
        const stringToSign = [
            algorithm,
            amzDate,
            credentialScope,
            await this.sha256(canonicalRequest)
        ].join('\n');
        
        // Calculate signature
        const signingKey = await this.getSignatureKey(secretAccessKey, dateStamp, region, service);
        const signatureBytes = await this.hmacSha256(signingKey, stringToSign);
        const signature = Array.from(signatureBytes).map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Create authorization header
        const authorization = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
        
        // Return signed headers
        const signedHeadersObj = { ...headers };
        signedHeadersObj['X-Amz-Date'] = amzDate;
        signedHeadersObj['Authorization'] = authorization;
        
        if (sessionToken) {
            signedHeadersObj['X-Amz-Security-Token'] = sessionToken;
        }
        
        return signedHeadersObj;
    }

    /**
     * Get AWS signature key
     */
    async getSignatureKey(key, dateStamp, regionName, serviceName) {
        const kDate = await this.hmacSha256('AWS4' + key, dateStamp);
        const kRegion = await this.hmacSha256(kDate, regionName);
        const kService = await this.hmacSha256(kRegion, serviceName);
        const kSigning = await this.hmacSha256(kService, 'aws4_request');
        return kSigning;
    }

    /**
     * HMAC SHA256 hash
     */
    async hmacSha256(key, data) {
        const encoder = new TextEncoder();
        const keyData = typeof key === 'string' ? encoder.encode(key) : key;
        const dataBuffer = encoder.encode(data);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
        return new Uint8Array(signature);
    }

    /**
     * SHA256 hash (hex)
     */
    async sha256(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}