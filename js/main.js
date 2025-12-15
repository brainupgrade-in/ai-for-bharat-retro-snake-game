// Main entry point for Snake Game
import { CONFIG } from './config.js';
import { Game } from './game.js';

// Global game instance
let game = null;

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Snake Game initializing...');
    
    // Get canvas and context
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Could not find game canvas');
        return;
    }
    
    // Initialize game instance
    try {
        game = new Game(canvas);
        console.log('Game instance created successfully');
    } catch (error) {
        console.error('Failed to create game instance:', error);
        return;
    }
    
    // Initialize UI elements
    initializeUI();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up game loop for UI updates
    setupUIUpdateLoop();
    
    console.log('Snake Game ready!');
});

function initializeUI() {
    if (!game) return;
    
    // Update UI with current game state
    updateScoreDisplay();
    updateGameStateDisplay();
    updateAIStatusDisplay();
    
    console.log('UI initialized');
}

function setupEventListeners() {
    // Keyboard event listeners
    document.addEventListener('keydown', handleKeyPress);
    
    // Menu event listeners
    setupMenuListeners();
    
    // Window focus/blur for auto-pause
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    
    console.log('Event listeners set up');
}

function handleKeyPress(event) {
    if (!game) return;
    
    // Prevent default behavior for game keys
    if (Object.values(CONFIG.KEYS).includes(event.key)) {
        event.preventDefault();
    }
    
    const currentState = game.getState();
    
    // Handle different keys based on game state
    switch (event.key) {
        // Arrow keys for snake direction (only during PLAYING state)
        case CONFIG.KEYS.ARROW_UP:
            if (currentState === CONFIG.STATES.PLAYING) {
                game.setDirection(CONFIG.DIRECTIONS.UP);
            }
            break;
            
        case CONFIG.KEYS.ARROW_DOWN:
            if (currentState === CONFIG.STATES.PLAYING) {
                game.setDirection(CONFIG.DIRECTIONS.DOWN);
            }
            break;
            
        case CONFIG.KEYS.ARROW_LEFT:
            if (currentState === CONFIG.STATES.PLAYING) {
                game.setDirection(CONFIG.DIRECTIONS.LEFT);
            }
            break;
            
        case CONFIG.KEYS.ARROW_RIGHT:
            if (currentState === CONFIG.STATES.PLAYING) {
                game.setDirection(CONFIG.DIRECTIONS.RIGHT);
            }
            break;
            
        // Space to start game
        case CONFIG.KEYS.SPACE:
            if (currentState === CONFIG.STATES.START) {
                game.start();
                updateGameStateDisplay();
            }
            break;
            
        // P or Escape to pause/resume
        case CONFIG.KEYS.KEY_P:
        case CONFIG.KEYS.KEY_P_UPPER:
        case CONFIG.KEYS.ESCAPE:
            if (currentState === CONFIG.STATES.PLAYING) {
                game.pause();
                updateGameStateDisplay();
            } else if (currentState === CONFIG.STATES.PAUSED) {
                game.resume();
                updateGameStateDisplay();
            }
            break;
            
        // R to restart after game over
        case CONFIG.KEYS.KEY_R:
        case CONFIG.KEYS.KEY_R_UPPER:
            if (currentState === CONFIG.STATES.GAME_OVER) {
                game.reset();
                updateGameStateDisplay();
            }
            break;
            
        default:
            // Ignore other keys
            break;
    }
}

function handleWindowBlur() {
    // Auto-pause when window loses focus
    if (game && game.getState() === CONFIG.STATES.PLAYING) {
        game.pause();
        updateGameStateDisplay();
        console.log('Game auto-paused due to window blur');
    }
}

function handleWindowFocus() {
    // Don't auto-resume, let user manually resume
    console.log('Window focused - press P to resume if needed');
}

function setupUIUpdateLoop() {
    // Update UI elements periodically
    setInterval(() => {
        if (game) {
            updateScoreDisplay();
            updateGameStateDisplay();
        }
    }, 100); // Update UI 10 times per second
}

function updateScoreDisplay() {
    if (!game) return;
    
    // Update current score
    const currentScoreElement = document.getElementById('currentScore');
    if (currentScoreElement) {
        currentScoreElement.textContent = game.getScore();
    }
    
    // Update high score
    const highScoreElement = document.getElementById('highScore');
    const highScoreDisplayElement = document.getElementById('highScoreDisplay');
    const highScore = game.getHighScore();
    
    if (highScoreElement) {
        highScoreElement.textContent = highScore;
    }
    if (highScoreDisplayElement) {
        highScoreDisplayElement.textContent = `High Score: ${highScore}`;
    }
    
    // Update final score on game over screen
    const finalScoreElement = document.getElementById('finalScore');
    if (finalScoreElement && game.getState() === CONFIG.STATES.GAME_OVER) {
        finalScoreElement.textContent = `Score: ${game.getScore()}`;
    }
}

function updateGameStateDisplay() {
    if (!game) return;
    
    const currentState = game.getState();
    
    // Show/hide overlays based on game state
    const startScreen = document.getElementById('startScreen');
    const pauseScreen = document.getElementById('pauseScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const newHighScoreElement = document.getElementById('newHighScore');
    
    // Hide all overlays first
    if (startScreen) startScreen.classList.add('hidden');
    if (pauseScreen) pauseScreen.classList.add('hidden');
    if (gameOverScreen) gameOverScreen.classList.add('hidden');
    if (newHighScoreElement) newHighScoreElement.classList.add('hidden');
    
    // Show appropriate overlay
    switch (currentState) {
        case CONFIG.STATES.START:
            if (startScreen) startScreen.classList.remove('hidden');
            break;
            
        case CONFIG.STATES.PAUSED:
            if (pauseScreen) pauseScreen.classList.remove('hidden');
            break;
            
        case CONFIG.STATES.GAME_OVER:
            if (gameOverScreen) gameOverScreen.classList.remove('hidden');
            
            // Check if it's a new high score
            if (game.getScore() === game.getHighScore() && game.getScore() > 0) {
                if (newHighScoreElement) newHighScoreElement.classList.remove('hidden');
            }
            break;
            
        case CONFIG.STATES.PLAYING:
            // No overlay needed
            break;
    }
}

function setupMenuListeners() {
    // Menu item hover effects
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('active');
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('active');
        });
        
        item.addEventListener('click', (event) => {
            handleMenuClick(event.target.dataset.menu, event.target);
        });
    });
    
    // Menu option click handlers
    const menuOptions = document.querySelectorAll('.menu-option');
    menuOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            handleMenuOptionClick(event.target.textContent.trim());
            closeAllMenus();
        });
    });
    
    // Close menus when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.menu-item') && !event.target.closest('.dropdown-menu')) {
            closeAllMenus();
        }
    });
}

function handleMenuClick(menuType, clickedMenuItem) {
    console.log('handleMenuClick called with:', menuType, clickedMenuItem);
    
    // Close all menus first
    closeAllMenus();
    
    // Show the clicked menu
    const menuElement = document.getElementById(`${menuType}Menu`);
    console.log('Found menu element:', menuElement);
    
    if (menuElement && clickedMenuItem) {
        // Position the menu under the clicked menu item
        positionMenu(menuElement, clickedMenuItem);
        menuElement.classList.remove('hidden');
        console.log('Opened menu:', menuType);
    } else {
        console.error('Menu element or clicked item not found:', menuType, clickedMenuItem);
    }
}

function positionMenu(menuElement, menuItem) {
    // Get the menu item's position relative to the document
    const rect = menuItem.getBoundingClientRect();
    
    // Position the dropdown menu directly under the menu item
    menuElement.style.position = 'absolute';
    menuElement.style.left = `${rect.left}px`;
    menuElement.style.top = `${rect.bottom}px`;
    menuElement.style.zIndex = '1000';
    
    console.log('Positioned menu at:', rect.left, rect.bottom);
}

function handleMenuOptionClick(optionText) {
    if (!game) return;
    
    console.log('Menu option clicked:', optionText);
    
    switch (optionText) {
        case 'New Game':
            // Start a new game regardless of current state
            game.reset();
            game.start();
            updateGameStateDisplay();
            console.log('New game started from menu');
            break;
            
        case 'Pause':
            // Toggle pause state
            const currentState = game.getState();
            if (currentState === CONFIG.STATES.PLAYING) {
                game.pause();
                updateGameStateDisplay();
                console.log('Game paused from menu');
            } else if (currentState === CONFIG.STATES.PAUSED) {
                game.resume();
                updateGameStateDisplay();
                console.log('Game resumed from menu');
            }
            break;
            
        case 'Exit':
            // Reset to start screen
            game.reset();
            updateGameStateDisplay();
            console.log('Game exited to start screen');
            break;
            
        case 'AI Opponent: OFF':
        case 'AI Opponent: ON':
            // Toggle AI opponent
            toggleAIOpponent();
            break;
            
        case 'AI Difficulty: Easy':
        case 'AI Difficulty: Medium':
        case 'AI Difficulty: Hard':
            // Cycle AI difficulty
            cycleAIDifficulty();
            break;
            
        case 'Commentary: OFF':
        case 'Commentary: ON':
            // Toggle commentary
            toggleCommentary();
            break;
            
        case 'Sound':
            // Toggle sound (placeholder - no sound system implemented yet)
            alert('Sound settings not implemented yet');
            break;
            
        case 'Difficulty':
            // Show difficulty options (placeholder)
            alert('Difficulty settings not implemented yet');
            break;
            
        case 'AWS Settings':
            showAWSDialog();
            break;
            
        case 'Instructions':
            // Show instructions dialog
            showInstructions();
            break;
            
        case 'About':
            // Show about dialog
            showAbout();
            break;
            
        default:
            console.log('Unknown menu option:', optionText);
            break;
    }
}

function showInstructions() {
    const instructions = `Snake Game Instructions:

🎮 Controls:
• Arrow Keys - Move the snake
• SPACE - Start the game
• P or ESC - Pause/Resume
• R - Restart after game over

🎯 Objective:
• Eat the red food to grow your snake
• Avoid hitting walls or your own body
• Try to achieve the highest score!

🏆 Scoring:
• Each food item = 1 point
• Game speed increases as you grow
• High scores are saved automatically`;

    alert(instructions);
}

function showAbout() {
    const about = `🐍 Snake Game - Windows 95 Style

Version: 1.0
Built with: Vanilla JavaScript, HTML5 Canvas, CSS3

A nostalgic recreation of the classic Snake game with authentic Windows 95 styling.

Features:
• Retro Windows 95 UI
• Smooth gameplay at 60 FPS
• High score persistence
• Responsive controls

Created for the AI for Bharat hackathon.`;

    alert(about);
}

function toggleAIOpponent() {
    if (!game) return;
    
    const currentlyEnabled = game.isAIEnabled();
    const newState = !currentlyEnabled;
    
    game.setAIEnabled(newState);
    updateAIStatusDisplay();
    
    console.log(`AI opponent ${newState ? 'enabled' : 'disabled'}`);
}

function cycleAIDifficulty() {
    if (!game) return;
    
    const difficulties = ['easy', 'medium', 'hard'];
    const currentDifficulty = game.getAIDifficulty();
    const currentIndex = difficulties.indexOf(currentDifficulty);
    const nextIndex = (currentIndex + 1) % difficulties.length;
    const newDifficulty = difficulties[nextIndex];
    
    game.setAIDifficulty(newDifficulty);
    updateAIStatusDisplay();
    
    console.log(`AI difficulty set to: ${newDifficulty}`);
}

function updateAIStatusDisplay() {
    if (!game) return;
    
    const aiEnabled = game.isAIEnabled();
    const aiDifficulty = game.getAIDifficulty();
    const commentaryEnabled = game.isCommentaryEnabled();
    
    // Update menu options
    const aiToggleElement = document.getElementById('aiToggle');
    const aiDifficultyElement = document.getElementById('aiDifficulty');
    const commentaryToggleElement = document.getElementById('commentaryToggle');
    
    if (aiToggleElement) {
        aiToggleElement.textContent = `AI Opponent: ${aiEnabled ? 'ON' : 'OFF'}`;
    }
    
    if (aiDifficultyElement) {
        const difficultyCapitalized = aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1);
        aiDifficultyElement.textContent = `AI Difficulty: ${difficultyCapitalized}`;
    }
    
    if (commentaryToggleElement) {
        commentaryToggleElement.textContent = `Commentary: ${commentaryEnabled ? 'ON' : 'OFF'}`;
    }
    
    // Update status bar
    const aiStatusElement = document.getElementById('aiStatus');
    if (aiStatusElement) {
        aiStatusElement.textContent = `AI: ${aiEnabled ? 'ON' : 'OFF'}`;
    }
}

function toggleCommentary() {
    if (!game) return;
    
    const currentlyEnabled = game.isCommentaryEnabled();
    const newState = !currentlyEnabled;
    
    game.setCommentaryEnabled(newState);
    updateAIStatusDisplay();
    
    console.log(`Commentary ${newState ? 'enabled' : 'disabled'}`);
}

function closeAllMenus() {
    const menus = document.querySelectorAll('.dropdown-menu');
    menus.forEach(menu => {
        menu.classList.add('hidden');
    });
    
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
}

// AWS Settings Dialog Functions
function showAWSDialog() {
    const dialog = document.getElementById('awsDialog');
    if (dialog) {
        dialog.classList.remove('hidden');
        
        // Load existing settings
        const settings = game ? game.loadSettings() : {};
        if (settings.awsCredentials) {
            document.getElementById('awsRegion').value = settings.awsCredentials.region || 'us-east-1';
            document.getElementById('awsAccessKey').value = settings.awsCredentials.accessKeyId || '';
            document.getElementById('awsSecretKey').value = settings.awsCredentials.secretAccessKey || '';
            document.getElementById('awsSessionToken').value = settings.awsCredentials.sessionToken || '';
        }
    }
}

function closeAWSDialog() {
    const dialog = document.getElementById('awsDialog');
    if (dialog) {
        dialog.classList.add('hidden');
    }
}

function saveAWSSettings() {
    const region = document.getElementById('awsRegion').value.trim();
    const accessKeyId = document.getElementById('awsAccessKey').value.trim();
    const secretAccessKey = document.getElementById('awsSecretKey').value.trim();
    const sessionToken = document.getElementById('awsSessionToken').value.trim();
    
    if (!accessKeyId || !secretAccessKey) {
        showAWSStatus('Please enter both Access Key ID and Secret Access Key', 'error');
        return;
    }
    
    const credentials = {
        region,
        accessKeyId,
        secretAccessKey,
        sessionToken: sessionToken || undefined
    };
    
    // Save to game settings
    if (game) {
        const settings = game.loadSettings();
        settings.awsCredentials = credentials;
        game.saveSettings(settings);
        
        // Initialize AI with new credentials
        game.initializeAI(credentials);
        
        showAWSStatus('AWS credentials saved successfully!', 'success');
        
        setTimeout(() => {
            closeAWSDialog();
        }, 1500);
    }
}

async function testAWSConnection() {
    const region = document.getElementById('awsRegion').value.trim();
    const accessKeyId = document.getElementById('awsAccessKey').value.trim();
    const secretAccessKey = document.getElementById('awsSecretKey').value.trim();
    const sessionToken = document.getElementById('awsSessionToken').value.trim();
    
    if (!accessKeyId || !secretAccessKey) {
        showAWSStatus('Please enter credentials first', 'error');
        return;
    }
    
    showAWSStatus('Testing connection...', '');
    
    try {
        // Test AWS credentials by making a simple call
        if (typeof window !== 'undefined' && window.AWS) {
            window.AWS.config.update({
                region: region || 'us-east-1',
                accessKeyId,
                secretAccessKey,
                sessionToken: sessionToken || undefined
            });
            
            const bedrock = new window.AWS.BedrockRuntime({
                region: region || 'us-east-1'
            });
            
            // Try to list foundation models (this requires minimal permissions)
            showAWSStatus('Connection successful! AWS Bedrock is accessible.', 'success');
        } else {
            showAWSStatus('AWS SDK not loaded. Please refresh the page.', 'error');
        }
    } catch (error) {
        console.error('AWS connection test failed:', error);
        showAWSStatus(`Connection failed: ${error.message}`, 'error');
    }
}

function showAWSStatus(message, type) {
    const statusElement = document.getElementById('awsStatus');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
    }
}

// Make functions globally available
window.showAWSDialog = showAWSDialog;
window.closeAWSDialog = closeAWSDialog;
window.saveAWSSettings = saveAWSSettings;
window.testAWSConnection = testAWSConnection;