// AI Commentary Manager for real-time game commentary
import { CONFIG } from './config.js';

export class CommentaryManager {
    constructor(aiService) {
        this.aiService = aiService;
        this.enabled = false;
        this.lastCommentTime = 0;
        this.cooldown = 5000; // 5 seconds
        this.displayTime = 4000; // 4 seconds
        this.eventQueue = [];
        this.isProcessing = false;
        
        // Event configuration
        this.eventTypes = {
            PLAYER_EAT: { priority: 'medium', template: 'player_score' },
            AI_EAT: { priority: 'medium', template: 'ai_score' },
            SCORE_MILESTONE: { priority: 'high', template: 'milestone' },
            NEAR_MISS: { priority: 'low', template: 'close_call' },
            PLAYER_WIN: { priority: 'critical', template: 'player_victory' },
            AI_WIN: { priority: 'critical', template: 'ai_victory' },
            DRAW: { priority: 'critical', template: 'draw' },
            COMEBACK: { priority: 'high', template: 'comeback' }
        };
        
        // Fallback comments for offline mode
        this.fallbackComments = {
            PLAYER_EAT: [
                "Nice catch!",
                "Score! Keep it up!",
                "Nom nom nom!",
                "That's how it's done!",
                "Radical move!",
                "Totally awesome!"
            ],
            AI_EAT: [
                "AI strikes back!",
                "Competition heating up!",
                "The AI is hungry too!",
                "Bogus! AI scored!",
                "Don't have a cow, man!"
            ],
            SCORE_MILESTONE: [
                "Milestone reached!",
                "You're on fire!",
                "Impressive score!",
                "That's totally tubular!",
                "All that and a bag of chips!"
            ],
            NEAR_MISS: [
                "Whoa, close call!",
                "That was close!",
                "Watch out!",
                "Almost pulled a Titanic there!",
                "Close but no cigar!"
            ],
            PLAYER_WIN: [
                "Victory! Well played!",
                "You win! Champion!",
                "Game over - You won!",
                "PLAYER WINS! That was phat!",
                "You're the bomb!"
            ],
            AI_WIN: [
                "AI wins this round.",
                "Better luck next time!",
                "The AI got you!",
                "Bogus! AI takes it.",
                "Don't sweat it, dude!"
            ],
            DRAW: [
                "It's a draw!",
                "Both down! Tie game!",
                "Mutual destruction!",
                "Plot twist! It's a tie!",
                "Both snakes bit the dust!"
            ],
            COMEBACK: [
                "Plot twist! Underdog takes the lead!",
                "Comeback city!",
                "The tables have turned!",
                "What a turnaround!",
                "From zero to hero!"
            ]
        };
        
        console.log('CommentaryManager initialized');
    }
    
    /**
     * Enable or disable commentary
     * @param {boolean} enabled - Whether to enable commentary
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        console.log(`Commentary ${enabled ? 'enabled' : 'disabled'}`);
        
        if (!enabled) {
            this.clearDisplay();
        }
    }
    
    /**
     * Check if commentary is enabled
     * @returns {boolean} True if commentary is enabled
     */
    isEnabled() {
        return this.enabled;
    }
    
    /**
     * Trigger a commentary event
     * @param {string} eventType - Type of event
     * @param {Object} eventData - Event data
     */
    async triggerEvent(eventType, eventData = {}) {
        console.log(`Commentary triggerEvent called: ${eventType}, enabled: ${this.enabled}`);
        
        if (!this.enabled) {
            console.log('Commentary disabled, skipping event');
            return;
        }
        
        const now = Date.now();
        const eventConfig = this.eventTypes[eventType];
        
        if (!eventConfig) {
            console.warn(`Unknown commentary event type: ${eventType}`);
            return;
        }
        
        // Critical events override cooldown
        if (eventConfig.priority !== 'critical') {
            if (now - this.lastCommentTime < this.cooldown) {
                console.log(`Commentary on cooldown, skipping ${eventType}`);
                return;
            }
        }
        
        this.lastCommentTime = now;
        console.log(`Generating commentary for ${eventType}`);
        
        try {
            // For now, always use fallback comments to ensure they work
            console.log('Using fallback comment for immediate display');
            const fallback = this.getFallbackComment(eventType);
            this.displayCommentary(fallback);
            
            // Uncomment below for AI-generated commentary when Bedrock is configured
            // const comment = await this.generateCommentary(eventType, eventData);
            // this.displayCommentary(comment);
        } catch (error) {
            console.warn('Commentary generation failed, using fallback:', error);
            const fallback = this.getFallbackComment(eventType);
            this.displayCommentary(fallback);
        }
    }
    
    /**
     * Generate AI commentary for an event
     * @param {string} eventType - Type of event
     * @param {Object} eventData - Event data
     * @returns {Promise<string>} Generated commentary
     */
    async generateCommentary(eventType, eventData) {
        if (!this.aiService || !this.aiService.isAvailable()) {
            throw new Error('AI service not available');
        }
        
        const prompt = this.buildPrompt(eventType, eventData);
        
        // Use a simplified request for commentary
        const gameState = {
            aiSnake: { body: [{ x: 0, y: 0 }], direction: 'RIGHT' },
            playerSnake: { body: [{ x: 0, y: 0 }], direction: 'RIGHT' },
            food: { x: 0, y: 0 },
            gridSize: 20
        };
        
        // Override the AI service's prompt building for commentary
        const originalBuildPrompt = this.aiService.buildPrompt;
        this.aiService.buildPrompt = () => prompt;
        
        try {
            const response = await this.aiService.getAIMove(gameState);
            // Restore original method
            this.aiService.buildPrompt = originalBuildPrompt;
            
            // Parse the response as commentary instead of a move
            return this.parseCommentaryResponse(response) || this.getFallbackComment(eventType);
        } catch (error) {
            // Restore original method
            this.aiService.buildPrompt = originalBuildPrompt;
            throw error;
        }
    }
    
    /**
     * Build prompt for commentary generation
     * @param {string} eventType - Type of event
     * @param {Object} eventData - Event data
     * @returns {string} Formatted prompt
     */
    buildPrompt(eventType, eventData) {
        const eventDetails = this.getEventDetails(eventType, eventData);
        
        return `You are a witty 1990s video game show host commentating on a Snake game.

Event: ${eventType}
Details: ${eventDetails}
Score: Player ${eventData.playerScore || 0} - AI ${eventData.aiScore || 0}

Generate a short, funny comment (10-15 words max).
Requirements:
- Use 90s slang (radical, tubular, bogus, all that, phat, etc.)
- Match the energy of the event
- Keep it family-friendly
- Be enthusiastic and fun

Reply with just the commentary text, no quotes or extra formatting.`;
    }
    
    /**
     * Get event-specific details for prompt
     * @param {string} eventType - Type of event
     * @param {Object} eventData - Event data
     * @returns {string} Event details
     */
    getEventDetails(eventType, eventData) {
        const details = {
            PLAYER_EAT: `Player just scored! Now has ${eventData.playerScore || 0} points.`,
            AI_EAT: `AI just scored! Now has ${eventData.aiScore || 0} points. Tease the player.`,
            SCORE_MILESTONE: `Player hit ${eventData.playerScore || 0} points! Big milestone!`,
            NEAR_MISS: `Player almost crashed into ${eventData.obstacle || 'something'}! Close call!`,
            PLAYER_WIN: `Player won with ${eventData.playerScore || 0} points! Celebrate!`,
            AI_WIN: `AI won with ${eventData.aiScore || 0} points. Console the player.`,
            DRAW: `Both snakes crashed! It's a tie!`,
            COMEBACK: `Trailing player just took the lead!`
        };
        
        return details[eventType] || 'Something interesting happened!';
    }
    
    /**
     * Parse commentary response from AI
     * @param {string} response - AI response
     * @returns {string|null} Parsed commentary or null if invalid
     */
    parseCommentaryResponse(response) {
        if (!response || typeof response !== 'string') {
            return null;
        }
        
        // Clean up the response
        let commentary = response.trim();
        
        // Remove quotes if present
        commentary = commentary.replace(/^["']|["']$/g, '');
        
        // Limit length
        if (commentary.length > 50) {
            commentary = commentary.substring(0, 47) + '...';
        }
        
        return commentary || null;
    }
    
    /**
     * Get a random fallback comment for an event
     * @param {string} eventType - Type of event
     * @returns {string} Fallback comment
     */
    getFallbackComment(eventType) {
        const comments = this.fallbackComments[eventType];
        if (!comments || comments.length === 0) {
            return "Totally radical!";
        }
        
        const randomIndex = Math.floor(Math.random() * comments.length);
        return comments[randomIndex];
    }
    
    /**
     * Display commentary with typing effect
     * @param {string} text - Commentary text to display
     */
    async displayCommentary(text) {
        console.log(`Displaying commentary: "${text}"`);
        
        const box = document.getElementById('commentary-box');
        if (!box) {
            console.warn('Commentary box not found');
            return;
        }
        
        console.log('Commentary box found, displaying text');
        
        // Clear any existing content and show the box
        box.textContent = '';
        box.classList.remove('hidden');
        box.style.display = 'block';
        
        // Typing effect
        for (let i = 0; i < text.length; i++) {
            box.textContent += text[i];
            await this.sleep(25); // 25ms per character
        }
        
        // Auto-clear after display time
        setTimeout(() => {
            this.clearDisplay();
        }, this.displayTime);
    }
    
    /**
     * Clear the commentary display
     */
    clearDisplay() {
        const box = document.getElementById('commentary-box');
        if (box) {
            box.textContent = '';
            box.classList.add('hidden');
        }
    }
    
    /**
     * Sleep utility for typing effect
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise} Promise that resolves after delay
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Detect near miss events
     * @param {Object} snake - Snake object
     * @param {Object} gameState - Current game state
     * @returns {string|null} Obstacle type if near miss detected
     */
    detectNearMiss(snake, gameState) {
        const head = snake.getHead();
        const directions = [
            { dx: 0, dy: -1, name: 'wall' },
            { dx: 0, dy: 1, name: 'wall' },
            { dx: -1, dy: 0, name: 'wall' },
            { dx: 1, dy: 0, name: 'wall' }
        ];
        
        for (const dir of directions) {
            const checkPos = { x: head.x + dir.dx, y: head.y + dir.dy };
            
            // Check wall collision
            if (checkPos.x < 0 || checkPos.x >= gameState.gridSize || 
                checkPos.y < 0 || checkPos.y >= gameState.gridSize) {
                return 'wall';
            }
            
            // Check snake body collision
            if (snake.body.some(segment => segment.x === checkPos.x && segment.y === checkPos.y)) {
                return 'self';
            }
        }
        
        return null;
    }
}