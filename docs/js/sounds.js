// Sound management system for retro Snake game
import { CONFIG } from './config.js';

export class SoundManager {
    constructor() {
        this.enabled = true;
        this.volume = 0.5;
        this.sounds = {};
        this.audioContext = null;
        
        // Initialize audio context
        this.initializeAudioContext();
        
        // Generate retro sound effects
        this.generateSounds();
        
        console.log('SoundManager initialized');
    }
    
    /**
     * Initialize Web Audio API context
     */
    initializeAudioContext() {
        try {
            // Create audio context (with fallback for older browsers)
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Audio context created');
        } catch (error) {
            console.warn('Could not create audio context:', error);
            this.audioContext = null;
        }
    }
    
    /**
     * Generate retro 8-bit style sound effects using Web Audio API
     */
    generateSounds() {
        if (!this.audioContext) {
            console.warn('No audio context available for sound generation');
            return;
        }
        
        // Generate different sound effects
        this.sounds = {
            eat: this.generateEatSound(),
            die: this.generateDieSound(),
            start: this.generateStartSound(),
            pause: this.generatePauseSound(),
            resume: this.generateResumeSound(),
            milestone: this.generateMilestoneSound(),
            win: this.generateWinSound(),
            lose: this.generateLoseSound()
        };
        
        console.log('Retro sound effects generated');
    }
    
    /**
     * Generate eating sound (short beep)
     */
    generateEatSound() {
        return {
            frequency: 800,
            duration: 0.1,
            type: 'square',
            volume: 0.3
        };
    }
    
    /**
     * Generate death sound (descending tone)
     */
    generateDieSound() {
        return {
            frequency: 200,
            duration: 0.5,
            type: 'sawtooth',
            volume: 0.4,
            sweep: { start: 400, end: 100 }
        };
    }
    
    /**
     * Generate start game sound (ascending beeps)
     */
    generateStartSound() {
        return {
            frequency: 400,
            duration: 0.3,
            type: 'square',
            volume: 0.3,
            sequence: [400, 500, 600]
        };
    }
    
    /**
     * Generate pause sound (two-tone)
     */
    generatePauseSound() {
        return {
            frequency: 300,
            duration: 0.2,
            type: 'triangle',
            volume: 0.2,
            sequence: [300, 250]
        };
    }
    
    /**
     * Generate resume sound (ascending tone)
     */
    generateResumeSound() {
        return {
            frequency: 250,
            duration: 0.2,
            type: 'triangle',
            volume: 0.2,
            sweep: { start: 250, end: 350 }
        };
    }
    
    /**
     * Generate milestone sound (fanfare)
     */
    generateMilestoneSound() {
        return {
            frequency: 600,
            duration: 0.4,
            type: 'square',
            volume: 0.4,
            sequence: [600, 700, 800, 900]
        };
    }
    
    /**
     * Generate win sound (victory fanfare)
     */
    generateWinSound() {
        return {
            frequency: 500,
            duration: 0.6,
            type: 'square',
            volume: 0.4,
            sequence: [500, 600, 700, 800, 900]
        };
    }
    
    /**
     * Generate lose sound (sad trombone)
     */
    generateLoseSound() {
        return {
            frequency: 300,
            duration: 0.8,
            type: 'sawtooth',
            volume: 0.3,
            sweep: { start: 300, end: 150 }
        };
    }
    
    /**
     * Play a sound effect
     * @param {string} soundName - Name of the sound to play
     */
    async playSound(soundName) {
        if (!this.enabled || !this.audioContext || !this.sounds[soundName]) {
            return;
        }
        
        // Resume audio context if suspended (required by some browsers)
        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (error) {
                console.warn('Could not resume audio context:', error);
                return;
            }
        }
        
        const soundConfig = this.sounds[soundName];
        
        try {
            if (soundConfig.sequence) {
                // Play sequence of tones
                this.playSequence(soundConfig);
            } else if (soundConfig.sweep) {
                // Play frequency sweep
                this.playSweep(soundConfig);
            } else {
                // Play single tone
                this.playTone(soundConfig);
            }
        } catch (error) {
            console.warn(`Error playing sound ${soundName}:`, error);
        }
    }
    
    /**
     * Play a single tone
     * @param {Object} config - Sound configuration
     */
    playTone(config) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Configure oscillator
        oscillator.type = config.type || 'square';
        oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime);
        
        // Configure gain (volume)
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
            config.volume * this.volume, 
            this.audioContext.currentTime + 0.01
        );
        gainNode.gain.exponentialRampToValueAtTime(
            0.001, 
            this.audioContext.currentTime + config.duration
        );
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Start and stop
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + config.duration);
    }
    
    /**
     * Play a frequency sweep
     * @param {Object} config - Sound configuration
     */
    playSweep(config) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Configure oscillator
        oscillator.type = config.type || 'square';
        oscillator.frequency.setValueAtTime(config.sweep.start, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(
            config.sweep.end, 
            this.audioContext.currentTime + config.duration
        );
        
        // Configure gain
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
            config.volume * this.volume, 
            this.audioContext.currentTime + 0.01
        );
        gainNode.gain.exponentialRampToValueAtTime(
            0.001, 
            this.audioContext.currentTime + config.duration
        );
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Start and stop
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + config.duration);
    }
    
    /**
     * Play a sequence of tones
     * @param {Object} config - Sound configuration
     */
    playSequence(config) {
        const toneDuration = config.duration / config.sequence.length;
        
        config.sequence.forEach((frequency, index) => {
            const startTime = this.audioContext.currentTime + (index * toneDuration);
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Configure oscillator
            oscillator.type = config.type || 'square';
            oscillator.frequency.setValueAtTime(frequency, startTime);
            
            // Configure gain
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(
                config.volume * this.volume, 
                startTime + 0.01
            );
            gainNode.gain.exponentialRampToValueAtTime(
                0.001, 
                startTime + toneDuration - 0.01
            );
            
            // Connect nodes
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Start and stop
            oscillator.start(startTime);
            oscillator.stop(startTime + toneDuration);
        });
    }
    
    /**
     * Enable or disable sound
     * @param {boolean} enabled - Whether to enable sound
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        console.log(`Sound ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Check if sound is enabled
     * @returns {boolean} True if sound is enabled
     */
    isEnabled() {
        return this.enabled;
    }
    
    /**
     * Set master volume
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        console.log(`Volume set to: ${Math.round(this.volume * 100)}%`);
    }
    
    /**
     * Get current volume
     * @returns {number} Current volume (0.0 to 1.0)
     */
    getVolume() {
        return this.volume;
    }
    
    /**
     * Test sound system by playing a test tone
     */
    testSound() {
        this.playSound('eat');
        console.log('Sound test played');
    }
}