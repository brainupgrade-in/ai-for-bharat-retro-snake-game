// Game configuration constants

export const CONFIG = {
    // Grid settings
    GRID_SIZE: 20,
    CELL_SIZE: 20,
    CANVAS_WIDTH: 400,
    CANVAS_HEIGHT: 400,
    
    // Game timing
    INITIAL_SPEED: 150, // milliseconds per move
    MIN_SPEED: 80,      // fastest possible speed
    SPEED_INCREMENT: 5, // speed increase per food eaten
    
    // Colors (Windows 95 palette)
    COLORS: {
        BACKGROUND: '#003300',
        SNAKE_BODY: '#00FF00',
        SNAKE_HEAD: '#00CC00',
        AI_SNAKE_BODY: '#FF6600',
        AI_SNAKE_HEAD: '#FF3300',
        FOOD: '#FF0000',
        GRID_LINE: '#004400',
        
        // UI Colors
        WINDOW_BG: '#C0C0C0',
        TITLE_BAR: '#000080',
        TITLE_TEXT: '#FFFFFF',
        BUTTON_FACE: '#C0C0C0',
        BUTTON_HIGHLIGHT: '#FFFFFF',
        BUTTON_SHADOW: '#808080',
        TEXT_PRIMARY: '#000000',
        TEXT_ACCENT: '#000080'
    },
    
    // Game states
    STATES: {
        START: 'START',
        PLAYING: 'PLAYING',
        PAUSED: 'PAUSED',
        GAME_OVER: 'GAME_OVER'
    },
    
    // Directions
    DIRECTIONS: {
        UP: 'UP',
        DOWN: 'DOWN',
        LEFT: 'LEFT',
        RIGHT: 'RIGHT'
    },
    
    // Key codes
    KEYS: {
        ARROW_UP: 'ArrowUp',
        ARROW_DOWN: 'ArrowDown',
        ARROW_LEFT: 'ArrowLeft',
        ARROW_RIGHT: 'ArrowRight',
        SPACE: ' ',
        ESCAPE: 'Escape',
        KEY_P: 'p',
        KEY_P_UPPER: 'P',
        KEY_R: 'r',
        KEY_R_UPPER: 'R'
    },
    
    // Snake settings
    SNAKE: {
        INITIAL_LENGTH: 3,
        INITIAL_X: 10,
        INITIAL_Y: 10,
        INITIAL_DIRECTION: 'RIGHT'
    },
    
    // AI Snake settings
    AI_SNAKE: {
        INITIAL_LENGTH: 3,
        INITIAL_X: 15,
        INITIAL_Y: 15,
        INITIAL_DIRECTION: 'LEFT'
    },
    
    // AI settings
    AI: {
        ENABLED: false,
        DIFFICULTY: 'medium',
        MAX_RESPONSE_TIME: 500,
        CACHE_DURATION: 150
    },
    
    // Storage keys
    STORAGE: {
        HIGH_SCORE: 'snakeHighScore',
        SETTINGS: 'snakeSettings'
    },
    
    // Default settings
    DEFAULT_SETTINGS: {
        aiEnabled: false,
        aiDifficulty: 'medium',
        commentaryEnabled: true,
        soundEnabled: true
    }
};

// Direction mappings
export const DIRECTION_VECTORS = {
    [CONFIG.DIRECTIONS.UP]: { x: 0, y: -1 },
    [CONFIG.DIRECTIONS.DOWN]: { x: 0, y: 1 },
    [CONFIG.DIRECTIONS.LEFT]: { x: -1, y: 0 },
    [CONFIG.DIRECTIONS.RIGHT]: { x: 1, y: 0 }
};

// Opposite directions for reverse prevention
export const OPPOSITE_DIRECTIONS = {
    [CONFIG.DIRECTIONS.UP]: CONFIG.DIRECTIONS.DOWN,
    [CONFIG.DIRECTIONS.DOWN]: CONFIG.DIRECTIONS.UP,
    [CONFIG.DIRECTIONS.LEFT]: CONFIG.DIRECTIONS.RIGHT,
    [CONFIG.DIRECTIONS.RIGHT]: CONFIG.DIRECTIONS.LEFT
};

// Collision types
export const COLLISION_TYPES = {
    NONE: 'NONE',
    WALL: 'WALL',
    SELF: 'SELF',
    FOOD: 'FOOD',
    AI_SNAKE: 'AI_SNAKE',
    PLAYER_SNAKE: 'PLAYER_SNAKE'
};