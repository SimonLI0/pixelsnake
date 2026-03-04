function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function gridCols() {
    return Math.floor(CANVAS_WIDTH / GRID_SIZE);
}

function gridRows() {
    return Math.floor(CANVAS_HEIGHT / GRID_SIZE);
}