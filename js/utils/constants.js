// Game constants - configurable at runtime
var CANVAS_WIDTH = 320;
var CANVAS_HEIGHT = 320;
var GRID_SIZE = 16;       // pixels per cell
var GAME_SPEED = 120;     // ms per tick (wild mode default)
var VOLUME = 0.5;

// Standard mode fixed parameters (cannot be changed by player)
var STANDARD_SPEED = 120;       // fixed 120ms per tick
var STANDARD_CANVAS = 320;      // fixed 320×320
var STANDARD_GRID = 16;         // fixed 16px grid

// Current game mode: 'standard' | 'wild'
var GAME_MODE = 'standard';

var COLORS = {
    BACKGROUND: '#9BBC0F',
    GRID_LINE:  '#8BAC0F',
    SNAKE_HEAD: '#0F380F',
    SNAKE_BODY: '#306230',
    FOOD:       '#D32F2F',
    TEXT:       '#0F380F'
};