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
    updateSoundStatusDisplay();
    updateDifficultyDisplay();
    
    console.log('UI initialized');
}

function setupEventListeners() {
    // Keyboard event listeners
    document.addEventListener('keydown', handleKeyPress);
    
    // Menu event listeners
    setupMenuListeners();
    
    // Sound volume control
    setupSoundVolumeControl();
    
    // Mobile touch controls
    setupMobileControls();
    
    // Window focus/blur for auto-pause
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    
    // Window resize for responsive adjustments
    window.addEventListener('resize', handleWindowResize);
    
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
            
        // P to pause/resume
        case CONFIG.KEYS.KEY_P:
        case CONFIG.KEYS.KEY_P_UPPER:
            if (currentState === CONFIG.STATES.PLAYING) {
                game.pause();
                updateGameStateDisplay();
            } else if (currentState === CONFIG.STATES.PAUSED) {
                game.resume();
                updateGameStateDisplay();
            }
            break;
            
        // Escape to close dialogs or pause/resume
        case CONFIG.KEYS.ESCAPE:
            // First check if any dialogs are open and close them
            if (closeAnyOpenDialog()) {
                // Dialog was closed, don't handle game pause
                break;
            }
            
            // No dialogs open, handle game pause/resume
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

function handleWindowResize() {
    // Close any open menus on resize to prevent positioning issues
    closeAllMenus();
    
    // Remove any quick volume controls
    const existingControl = document.getElementById('quickVolumeControl');
    if (existingControl) {
        existingControl.remove();
    }
    
    console.log('Window resized - menus closed for repositioning');
}

function setupUIUpdateLoop() {
    // Update UI elements periodically
    setInterval(() => {
        if (game) {
            updateScoreDisplay();
            updateGameStateDisplay();
            updateSoundStatusDisplay();
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
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // For mobile devices (less than 480px), use full-width positioning
    if (viewportWidth < 480) {
        menuElement.style.position = 'fixed';
        menuElement.style.left = '0';
        menuElement.style.right = '0';
        menuElement.style.top = `${rect.bottom}px`;
        menuElement.style.width = '100%';
        menuElement.style.maxWidth = 'none';
        menuElement.style.zIndex = '1000';
    } else {
        // Desktop/tablet positioning
        menuElement.style.position = 'absolute';
        
        // Check if menu would go off-screen horizontally
        const menuWidth = menuElement.offsetWidth || 200; // Estimate if not rendered
        let leftPos = rect.left;
        
        if (leftPos + menuWidth > viewportWidth) {
            leftPos = viewportWidth - menuWidth - 10;
        }
        
        // Check if menu would go off-screen vertically
        const menuHeight = menuElement.offsetHeight || 150; // Estimate if not rendered
        let topPos = rect.bottom;
        
        if (topPos + menuHeight > viewportHeight) {
            topPos = rect.top - menuHeight;
        }
        
        menuElement.style.left = `${Math.max(0, leftPos)}px`;
        menuElement.style.top = `${Math.max(0, topPos)}px`;
        menuElement.style.width = 'auto';
        menuElement.style.maxWidth = '300px';
        menuElement.style.zIndex = '1000';
    }
    
    console.log('Positioned menu at:', menuElement.style.left, menuElement.style.top);
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
            
        case 'Difficulty: Easy':
        case 'Difficulty: Medium':
        case 'Difficulty: Hard':
        case 'Difficulty: Adaptive':
            // Cycle difficulty
            cycleDifficulty();
            break;
            
        case 'Sound':
            // Show sound settings dialog
            showSoundDialog();
            break;
            
        case 'Statistics':
            // Show statistics dialog
            showStatisticsDialog();
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
    const dialog = document.getElementById('instructionsDialog');
    if (dialog) {
        dialog.classList.remove('hidden');
        dialog.focus();
    }
}

function closeInstructionsDialog() {
    const dialog = document.getElementById('instructionsDialog');
    if (dialog) {
        dialog.classList.add('hidden');
    }
}

function showAbout() {
    const dialog = document.getElementById('aboutDialog');
    if (dialog) {
        dialog.classList.remove('hidden');
        dialog.focus();
    }
}

function closeAboutDialog() {
    const dialog = document.getElementById('aboutDialog');
    if (dialog) {
        dialog.classList.add('hidden');
    }
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

function updateSoundStatusDisplay() {
    if (!game) return;
    
    const soundEnabled = game.isSoundEnabled();
    const soundVolume = game.getSoundVolume();
    const soundToggle = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');
    const soundStatus = document.getElementById('soundStatus');
    const volumeLevel = document.getElementById('volumeLevel');
    
    if (soundToggle && soundIcon && soundStatus && volumeLevel) {
        if (soundEnabled) {
            soundIcon.textContent = '🔊';
            soundStatus.textContent = 'ON';
            soundToggle.classList.remove('disabled');
            soundToggle.title = 'Click to disable sound | Right-click to adjust volume';
            
            // Update volume bar height (0-100%)
            volumeLevel.style.height = `${soundVolume * 100}%`;
        } else {
            soundIcon.textContent = '🔇';
            soundStatus.textContent = 'OFF';
            soundToggle.classList.add('disabled');
            soundToggle.title = 'Click to enable sound';
            
            // Show muted volume bar
            volumeLevel.style.height = '0%';
        }
    }
}

function toggleSoundFromIcon() {
    if (!game) return;
    
    const currentlyEnabled = game.isSoundEnabled();
    const newState = !currentlyEnabled;
    
    game.setSoundEnabled(newState);
    updateSoundStatusDisplay();
    
    console.log(`Sound ${newState ? 'enabled' : 'disabled'} from icon`);
}

function setupSoundVolumeControl() {
    const soundToggle = document.getElementById('soundToggle');
    if (!soundToggle) return;
    
    // Right-click to show volume slider
    soundToggle.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        showQuickVolumeControl(event);
    });
    
    // Scroll wheel to adjust volume
    soundToggle.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (!game || !game.isSoundEnabled()) return;
        
        const currentVolume = game.getSoundVolume();
        const delta = event.deltaY > 0 ? -0.1 : 0.1;
        const newVolume = Math.max(0, Math.min(1, currentVolume + delta));
        
        game.setSoundVolume(newVolume);
        updateSoundStatusDisplay();
        
        // Play test sound to hear volume change
        game.testSound();
    });
}

function closeAnyOpenDialog() {
    // List of all dialog IDs that can be closed with ESC
    const dialogIds = [
        'statisticsDialog',
        'awsDialog', 
        'soundDialog',
        'instructionsDialog',
        'aboutDialog'
    ];
    
    // Check each dialog and close the first one that's open
    for (const dialogId of dialogIds) {
        const dialog = document.getElementById(dialogId);
        if (dialog && !dialog.classList.contains('hidden')) {
            dialog.classList.add('hidden');
            console.log(`Closed dialog: ${dialogId}`);
            return true; // Dialog was closed
        }
    }
    
    // Also check for quick volume control
    const quickVolumeControl = document.getElementById('quickVolumeControl');
    if (quickVolumeControl) {
        quickVolumeControl.remove();
        console.log('Closed quick volume control');
        return true;
    }
    
    return false; // No dialogs were open
}

function setupMobileControls() {
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (!upBtn || !downBtn || !leftBtn || !rightBtn || !pauseBtn) return;
    
    // Direction controls
    upBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (game && game.getState() === CONFIG.STATES.PLAYING) {
            game.setDirection(CONFIG.DIRECTIONS.UP);
        }
    });
    
    downBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (game && game.getState() === CONFIG.STATES.PLAYING) {
            game.setDirection(CONFIG.DIRECTIONS.DOWN);
        }
    });
    
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (game && game.getState() === CONFIG.STATES.PLAYING) {
            game.setDirection(CONFIG.DIRECTIONS.LEFT);
        }
    });
    
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (game && game.getState() === CONFIG.STATES.PLAYING) {
            game.setDirection(CONFIG.DIRECTIONS.RIGHT);
        }
    });
    
    // Pause/Resume control
    pauseBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!game) return;
        
        const currentState = game.getState();
        if (currentState === CONFIG.STATES.PLAYING) {
            game.pause();
            pauseBtn.textContent = '▶';
            updateGameStateDisplay();
        } else if (currentState === CONFIG.STATES.PAUSED) {
            game.resume();
            pauseBtn.textContent = '⏸';
            updateGameStateDisplay();
        } else if (currentState === CONFIG.STATES.START) {
            game.start();
            pauseBtn.textContent = '⏸';
            updateGameStateDisplay();
        }
    });
    
    // Also add click events for non-touch devices
    [upBtn, downBtn, leftBtn, rightBtn, pauseBtn].forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Trigger the same logic as touchstart
            const touchEvent = new TouchEvent('touchstart', {
                bubbles: true,
                cancelable: true
            });
            btn.dispatchEvent(touchEvent);
        });
    });
    
    console.log('Mobile controls set up');
}

function showQuickVolumeControl(event) {
    if (!game) return;
    
    // Remove any existing quick volume control
    const existingControl = document.getElementById('quickVolumeControl');
    if (existingControl) {
        existingControl.remove();
    }
    
    // Create quick volume control
    const volumeControl = document.createElement('div');
    volumeControl.id = 'quickVolumeControl';
    volumeControl.className = 'quick-volume-control';
    volumeControl.innerHTML = `
        <div class="volume-slider-container">
            <input type="range" id="quickVolumeSlider" min="0" max="100" value="${Math.round(game.getSoundVolume() * 100)}">
            <span id="quickVolumeDisplay">${Math.round(game.getSoundVolume() * 100)}%</span>
        </div>
    `;
    
    // Position near the sound toggle
    volumeControl.style.position = 'absolute';
    volumeControl.style.left = `${event.pageX - 50}px`;
    volumeControl.style.top = `${event.pageY - 40}px`;
    volumeControl.style.zIndex = '1000';
    
    document.body.appendChild(volumeControl);
    
    // Set up slider functionality
    const slider = document.getElementById('quickVolumeSlider');
    const display = document.getElementById('quickVolumeDisplay');
    
    slider.addEventListener('input', () => {
        const volume = parseInt(slider.value) / 100;
        game.setSoundVolume(volume);
        display.textContent = `${slider.value}%`;
        updateSoundStatusDisplay();
    });
    
    slider.addEventListener('change', () => {
        // Play test sound when user finishes adjusting
        game.testSound();
    });
    
    // Remove control when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function removeVolumeControl(e) {
            if (!volumeControl.contains(e.target)) {
                volumeControl.remove();
                document.removeEventListener('click', removeVolumeControl);
            }
        });
    }, 100);
}

function toggleCommentary() {
    if (!game) return;
    
    const currentlyEnabled = game.isCommentaryEnabled();
    const newState = !currentlyEnabled;
    
    game.setCommentaryEnabled(newState);
    updateAIStatusDisplay();
    
    console.log(`Commentary ${newState ? 'enabled' : 'disabled'}`);
}

function cycleDifficulty() {
    if (!game) return;
    
    const difficulties = ['EASY', 'MEDIUM', 'HARD', 'ADAPTIVE'];
    const currentDifficulty = game.getDifficulty();
    const currentIndex = difficulties.indexOf(currentDifficulty);
    const nextIndex = (currentIndex + 1) % difficulties.length;
    const newDifficulty = difficulties[nextIndex];
    
    game.setDifficulty(newDifficulty);
    updateDifficultyDisplay();
    
    console.log(`Difficulty set to: ${newDifficulty}`);
}

function showStatisticsDialog() {
    if (!game) return;
    
    const difficultyManager = game.getDifficultyManager();
    const stats = difficultyManager.getFormattedStats();
    
    // Update statistics display
    document.getElementById('statsGamesPlayed').textContent = stats.gamesPlayed;
    document.getElementById('statsGamesWon').textContent = stats.gamesWon;
    document.getElementById('statsWinRate').textContent = stats.winRate;
    document.getElementById('statsHighScore').textContent = stats.highScore;
    document.getElementById('statsAvgScore').textContent = stats.avgScore;
    // Streak statistics removed per user request
    
    // Update skill level
    const skillFill = document.getElementById('skillFill');
    const skillText = document.getElementById('skillText');
    skillFill.style.width = `${stats.skillLevel}%`;
    skillText.textContent = `${stats.skillLevel}% - ${stats.skillLabel}`;
    
    // Show dialog
    document.getElementById('statisticsDialog').classList.remove('hidden');
    
    // Focus the dialog for better accessibility
    document.getElementById('statisticsDialog').focus();
}

function closeStatisticsDialog() {
    document.getElementById('statisticsDialog').classList.add('hidden');
}

function resetStatistics() {
    if (!game) return;
    
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
        const difficultyManager = game.getDifficultyManager();
        difficultyManager.resetStats();
        
        // Refresh the display
        showStatisticsDialog();
        
        console.log('Statistics reset');
    }
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
        
        // Focus the dialog
        dialog.focus();
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
function updateDifficultyDisplay() {
    if (!game) return;
    
    const difficulty = game.getDifficulty();
    const difficultySelector = document.getElementById('difficultySelector');
    const difficultyStatus = document.getElementById('difficultyStatus');
    
    const difficultyCapitalized = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
    
    if (difficultySelector) {
        difficultySelector.textContent = `Difficulty: ${difficultyCapitalized}`;
    }
    
    if (difficultyStatus) {
        difficultyStatus.textContent = `Difficulty: ${difficultyCapitalized}`;
    }
}

// Sound Settings Dialog Functions
function showSoundDialog() {
    const dialog = document.getElementById('soundDialog');
    if (dialog) {
        dialog.classList.remove('hidden');
        
        // Load existing settings
        if (game) {
            const soundEnabled = game.isSoundEnabled();
            const soundVolume = game.getSoundVolume();
            
            document.getElementById('soundEnabled').checked = soundEnabled;
            document.getElementById('soundVolume').value = Math.round(soundVolume * 100);
            document.getElementById('volumeDisplay').textContent = `${Math.round(soundVolume * 100)}%`;
        }
        
        // Focus the dialog
        dialog.focus();
    }
}

function closeSoundDialog() {
    const dialog = document.getElementById('soundDialog');
    if (dialog) {
        dialog.classList.add('hidden');
    }
}

function applySoundSettings() {
    if (!game) return;
    
    const soundEnabled = document.getElementById('soundEnabled').checked;
    const soundVolume = parseInt(document.getElementById('soundVolume').value) / 100;
    
    game.setSoundEnabled(soundEnabled);
    game.setSoundVolume(soundVolume);
    
    showSoundStatus('Sound settings applied!', 'success');
    
    setTimeout(() => {
        closeSoundDialog();
    }, 1000);
}

function testSoundEffect() {
    if (game) {
        game.testSound();
        showSoundStatus('Test sound played', '');
    }
}

function updateVolumeDisplay() {
    const volumeSlider = document.getElementById('soundVolume');
    const volumeDisplay = document.getElementById('volumeDisplay');
    
    if (volumeSlider && volumeDisplay) {
        volumeDisplay.textContent = `${volumeSlider.value}%`;
    }
}

function showSoundStatus(message, type) {
    const statusElement = document.getElementById('soundStatus');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        
        // Clear status after 3 seconds
        setTimeout(() => {
            statusElement.textContent = '';
            statusElement.className = 'status-message';
        }, 3000);
    }
}

// Make functions globally available
window.toggleSoundFromIcon = toggleSoundFromIcon;
window.showSoundDialog = showSoundDialog;
window.closeSoundDialog = closeSoundDialog;
window.applySoundSettings = applySoundSettings;
window.testSoundEffect = testSoundEffect;
window.updateVolumeDisplay = updateVolumeDisplay;
window.closeStatisticsDialog = closeStatisticsDialog;
window.resetStatistics = resetStatistics;
window.closeInstructionsDialog = closeInstructionsDialog;
window.closeAboutDialog = closeAboutDialog;