// Dynamic Difficulty Manager for adaptive gameplay
import { CONFIG } from './config.js';

export class DifficultyManager {
    constructor() {
        // Difficulty modes
        this.modes = {
            EASY: 'EASY',
            MEDIUM: 'MEDIUM', 
            HARD: 'HARD',
            ADAPTIVE: 'ADAPTIVE'
        };
        
        // Current difficulty mode
        this.mode = this.modes.MEDIUM;
        
        // Difficulty presets
        this.presets = {
            EASY: {
                speed: 200,
                aiAggression: 0.3,
                aiMistakeRate: 0.20
            },
            MEDIUM: {
                speed: 150,
                aiAggression: 0.5,
                aiMistakeRate: 0.05
            },
            HARD: {
                speed: 100,
                aiAggression: 0.8,
                aiMistakeRate: 0.0
            }
        };
        
        // Adaptive difficulty parameters
        this.currentSpeed = 150;
        this.currentAggression = 0.5;
        this.currentMistakeRate = 0.05;
        
        // Speed constraints
        this.minSpeed = 75;  // Fastest
        this.maxSpeed = 250; // Slowest
        
        // Metrics for tracking performance
        this.metrics = this.loadMetrics();
        
        console.log('DifficultyManager initialized');
    }
    
    /**
     * Load metrics from localStorage
     * @returns {Object} Metrics object
     */
    loadMetrics() {
        try {
            const saved = localStorage.getItem('snakeMetrics');
            if (saved) {
                const metrics = JSON.parse(saved);
                console.log('Metrics loaded:', metrics);
                return metrics;
            }
        } catch (error) {
            console.warn('Could not load metrics:', error);
        }
        
        // Return default metrics (highScore removed - now managed by game system)
        return {
            gamesPlayed: 0,
            gamesWon: 0,
            totalScore: 0,
            totalSurvivalTime: 0,
            recentGames: [],
            currentStreak: 0,
            bestStreak: 0
        };
    }
    
    /**
     * Save metrics to localStorage
     */
    saveMetrics() {
        try {
            localStorage.setItem('snakeMetrics', JSON.stringify(this.metrics));
            console.log('Metrics saved');
        } catch (error) {
            console.warn('Could not save metrics:', error);
        }
    }
    
    /**
     * Set difficulty mode
     * @param {string} mode - Difficulty mode
     */
    setMode(mode) {
        if (!this.modes[mode]) {
            console.warn(`Invalid difficulty mode: ${mode}`);
            return;
        }
        
        this.mode = mode;
        
        // Apply preset values for non-adaptive modes
        if (mode !== this.modes.ADAPTIVE) {
            const preset = this.presets[mode];
            this.currentSpeed = preset.speed;
            this.currentAggression = preset.aiAggression;
            this.currentMistakeRate = preset.aiMistakeRate;
        }
        
        console.log(`Difficulty set to: ${mode}`);
    }
    
    /**
     * Get current difficulty mode
     * @returns {string} Current mode
     */
    getMode() {
        return this.mode;
    }
    
    /**
     * Record game result for metrics tracking
     * @param {Object} result - Game result
     */
    recordGame(result) {
        const { won, score, survivalTime, aiScore } = result;
        
        // Update basic metrics
        this.metrics.gamesPlayed++;
        if (won) {
            this.metrics.gamesWon++;
        }
        
        this.metrics.totalScore += score;
        // Note: High score is now managed by the game system, not here
        
        this.metrics.totalSurvivalTime += survivalTime;
        
        // Update streaks
        if (won) {
            this.metrics.currentStreak++;
            if (this.metrics.currentStreak > this.metrics.bestStreak) {
                this.metrics.bestStreak = this.metrics.currentStreak;
            }
        } else {
            this.metrics.currentStreak = 0;
        }
        
        // Add to recent games (keep last 10)
        this.metrics.recentGames.push({
            won,
            score,
            survivalTime
        });
        
        if (this.metrics.recentGames.length > 10) {
            this.metrics.recentGames.shift();
        }
        
        // Save metrics
        this.saveMetrics();
        
        // Adjust difficulty if in adaptive mode
        if (this.mode === this.modes.ADAPTIVE) {
            this.adjustDifficulty();
        }
        
        console.log('Game recorded:', result);
    }
    
    /**
     * Get win rate percentage
     * @returns {number} Win rate (0-1)
     */
    getWinRate() {
        if (this.metrics.gamesPlayed === 0) return 0;
        return this.metrics.gamesWon / this.metrics.gamesPlayed;
    }
    
    /**
     * Get average score
     * @returns {number} Average score
     */
    getAvgScore() {
        if (this.metrics.gamesPlayed === 0) return 0;
        return this.metrics.totalScore / this.metrics.gamesPlayed;
    }
    
    /**
     * Get recent performance (last 10 games win rate)
     * @returns {number} Recent win rate (0-1)
     */
    getRecentPerformance() {
        if (this.metrics.recentGames.length === 0) return 0;
        
        const recentWins = this.metrics.recentGames.filter(game => game.won).length;
        return recentWins / this.metrics.recentGames.length;
    }
    
    /**
     * Calculate adaptive speed based on performance
     * @returns {number} Calculated speed in ms
     */
    calculateAdaptiveSpeed() {
        let speed = 150; // Base: Medium
        
        const winRate = this.getWinRate();
        
        // Winning too much? Speed up (lower ms = faster)
        if (winRate > 0.7) speed -= 25;
        else if (winRate > 0.6) speed -= 15;
        
        // Losing too much? Slow down (higher ms = slower)
        if (winRate < 0.3) speed += 25;
        else if (winRate < 0.4) speed += 15;
        
        // Recent performance adjustment
        const recent = this.getRecentPerformance();
        if (recent > 0.8) speed -= 15;
        else if (recent < 0.4) speed += 15;
        
        // Clamp to valid range
        return Math.max(this.minSpeed, Math.min(this.maxSpeed, speed));
    }
    
    /**
     * Calculate adaptive AI aggression based on performance
     * @returns {number} AI aggression (0-1)
     */
    calculateAIAggression() {
        let aggression = 0.5; // Base
        
        const winRate = this.getWinRate();
        
        if (winRate > 0.6) aggression += 0.2;
        else if (winRate < 0.4) aggression -= 0.2;
        
        return Math.max(0.1, Math.min(0.9, aggression));
    }
    
    /**
     * Calculate adaptive AI mistake rate based on performance
     * @returns {number} Mistake rate (0-1)
     */
    calculateMistakeRate() {
        const winRate = this.getWinRate();
        
        if (winRate > 0.7) return 0;
        if (winRate > 0.5) return 0.05;
        if (winRate > 0.3) return 0.15;
        return 0.25;
    }
    
    /**
     * Linear interpolation helper
     * @param {number} current - Current value
     * @param {number} target - Target value
     * @param {number} factor - Interpolation factor (0-1)
     * @returns {number} Interpolated value
     */
    lerp(current, target, factor) {
        return current + (target - current) * factor;
    }
    
    /**
     * Adjust difficulty parameters gradually (max 10% per game)
     */
    adjustDifficulty() {
        if (this.mode !== this.modes.ADAPTIVE) return;
        
        const targetSpeed = this.calculateAdaptiveSpeed();
        const targetAggression = this.calculateAIAggression();
        const targetMistake = this.calculateMistakeRate();
        
        // Lerp at 10% per adjustment for gradual changes
        this.currentSpeed = Math.round(this.lerp(this.currentSpeed, targetSpeed, 0.1));
        this.currentAggression = this.lerp(this.currentAggression, targetAggression, 0.1);
        this.currentMistakeRate = this.lerp(this.currentMistakeRate, targetMistake, 0.1);
        
        console.log('Difficulty adjusted:', {
            speed: this.currentSpeed,
            aggression: this.currentAggression.toFixed(2),
            mistakeRate: this.currentMistakeRate.toFixed(2)
        });
    }
    
    /**
     * Get current game speed
     * @returns {number} Game speed in ms
     */
    getGameSpeed() {
        return this.currentSpeed;
    }
    
    /**
     * Get current AI aggression level
     * @returns {number} AI aggression (0-1)
     */
    getAIAggression() {
        return this.currentAggression;
    }
    
    /**
     * Get current AI mistake rate
     * @returns {number} AI mistake rate (0-1)
     */
    getAIMistakeRate() {
        return this.currentMistakeRate;
    }
    
    /**
     * Estimate player skill level as percentage
     * @returns {number} Skill level percentage (0-100)
     */
    estimateSkillLevel() {
        if (this.metrics.gamesPlayed === 0) return 0;
        
        const winWeight = 0.4;
        const scoreWeight = 0.3;
        const streakWeight = 0.3;
        
        const winScore = Math.min(this.getWinRate() / 0.7, 1);
        const avgNorm = Math.min(this.getAvgScore() / 30, 1);
        const streakNorm = Math.min(this.metrics.bestStreak / 10, 1);
        
        const skill = (winScore * winWeight) +
                      (avgNorm * scoreWeight) +
                      (streakNorm * streakWeight);
        
        return Math.round(skill * 100);
    }
    
    /**
     * Get skill level label
     * @param {number} percent - Skill percentage
     * @returns {string} Skill label
     */
    getSkillLabel(percent) {
        if (percent >= 90) return 'Expert';
        if (percent >= 70) return 'Advanced';
        if (percent >= 50) return 'Intermediate';
        if (percent >= 30) return 'Beginner';
        return 'Novice';
    }
    
    /**
     * Reset all statistics
     */
    resetStats() {
        this.metrics = {
            gamesPlayed: 0,
            gamesWon: 0,
            totalScore: 0,
            totalSurvivalTime: 0,
            recentGames: [],
            currentStreak: 0,
            bestStreak: 0
        };
        
        this.saveMetrics();
        console.log('Statistics reset (high score managed separately by game system)');
    }
    
    /**
     * Get high score from the same localStorage key as the game
     * @returns {number} High score
     */
    getGameHighScore() {
        try {
            const saved = localStorage.getItem('snakeHighScore');
            return saved ? parseInt(saved, 10) : 0;
        } catch (error) {
            console.warn('Could not load high score:', error);
            return 0;
        }
    }
    
    /**
     * Get formatted statistics for display
     * @returns {Object} Formatted statistics
     */
    getFormattedStats() {
        const skillPercent = this.estimateSkillLevel();
        
        // Get high score from the same source as the game (localStorage)
        const gameHighScore = this.getGameHighScore();
        
        return {
            gamesPlayed: this.metrics.gamesPlayed,
            gamesWon: this.metrics.gamesWon,
            winRate: (this.getWinRate() * 100).toFixed(1) + '%',
            highScore: gameHighScore,
            avgScore: this.getAvgScore().toFixed(1),
            currentStreak: this.metrics.currentStreak,
            bestStreak: this.metrics.bestStreak,
            skillLevel: skillPercent,
            skillLabel: this.getSkillLabel(skillPercent)
        };
    }
}