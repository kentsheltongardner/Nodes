import Tile from './tile.js';
import Direction from './direction.js';
import Level from './level.js';
import Rect from './rect.js';
import Vector from './vector.js';
import Layer from './layer.js';
// Constraints
// Abilities
// Requirements
// Change what is connected to what
let UPDATES_PER_SECOND = 240;
let UPDATE_DURATION = 1000 / UPDATES_PER_SECOND;
let MAX_FRAME_DURATION = 250; // prevent spiral of death
let SPEED_MIN = 0.1;
let SPEED_MAX = 0.9;
let SPEED_FLATNESS = 2.52;
let ACCELERATION = 0.00087;
let BASE_SPEED_FRACTION = 0.4;
let DRAG_SPEED_FRACTION = 1 - BASE_SPEED_FRACTION;
let DECAY_TURN_FRACTION = 0.6;
let DECAY_STRAIGHT_FRACTION = 0.8;
let BLOCK_RADIUS_FRACTION = 0.125;
let SELECTION_LINE_WIDTH_FRACTION = 0.03;
function activateSlider(prefix, varName) {
    const label = document.getElementById(prefix + '-label');
    const input = document.getElementById(prefix + '-input');
    eval('input.value = ' + varName);
    const originalText = label.innerText;
    label.innerText = `${originalText} (${input.value})`;
    input.addEventListener('input', () => {
        eval(varName + '=' + input.value);
        label.innerText = `${originalText} (${input.value})`;
    });
}
function activateSliders() {
    activateSlider('min-speed', 'SPEED_MIN');
    activateSlider('max-speed', 'SPEED_MAX');
    activateSlider('acceleration', 'ACCELERATION');
    activateSlider('speed-flatness', 'SPEED_FLATNESS');
    activateSlider('base-speed-fraction', 'BASE_SPEED_FRACTION');
    activateSlider('straight-decay-fraction', 'DECAY_STRAIGHT_FRACTION');
    activateSlider('turn-decay-fraction', 'DECAY_TURN_FRACTION');
    activateSlider('radius-fraction', 'BLOCK_RADIUS_FRACTION');
    window.addEventListener('keydown', e => {
        if (e.code !== 'KeyV')
            return;
        const slidersBox = document.getElementById('sliders-box');
        slidersBox.style.display = slidersBox.style.display === 'none' ? 'block' : 'none';
    });
}
export default class Game {
    activeLayer = Layer.None;
    previousFrameTime = 0;
    simulationTime = 0;
    accumulator = 0;
    leftDown = false;
    leftDownStart = false;
    selectionX = 0;
    selectionY = 0;
    selection = false;
    position = 0;
    offsetX = 0;
    offsetY = 0;
    speed = 0;
    movementDirectionX = 0;
    movementDirectionY = 0;
    movingCount = 0;
    level = new Level(7, 6);
    gridX = 0;
    gridY = 0;
    levelX = 0;
    levelY = 0;
    gameCanvas = document.getElementById('game-canvas');
    gameContext = this.gameCanvas.getContext('2d');
    renderCellSize = 0;
    renderRect = new Rect(0, 0, 0, 0);
    constructor() {
        activateSliders();
        this.bindEvents();
        this.resize();
        requestAnimationFrame(t => this.loop(t));
    }
    bindEvents() {
        this.gameCanvas.addEventListener('mousedown', e => this.onMouseDown(e));
        this.gameCanvas.addEventListener('mousemove', e => this.onMouseMove(e));
        this.gameCanvas.addEventListener('mouseup', e => this.onMouseUp(e));
        this.gameCanvas.addEventListener('mouseleave', () => this.onMouseLeave());
        this.gameCanvas.addEventListener('contextmenu', () => this.onContextMenu());
        window.addEventListener('resize', () => this.resize());
    }
    onMouseDown(e) {
        if (e.button === 0) {
            this.leftDownStart = true;
            this.leftDown = true;
        }
    }
    onMouseMove(e) {
        const newX = this.getLevelX(e.offsetX);
        const newY = this.getLevelY(e.offsetY);
        this.levelX = newX;
        this.levelY = newY;
        this.gridX = Math.floor(newX);
        this.gridY = Math.floor(newY);
    }
    onMouseUp(e) {
        if (e.button === 0)
            this.leftDown = false;
    }
    onMouseLeave() { }
    onContextMenu() { }
    loop(frameTime) {
        const frameDuration = Math.min(frameTime - this.previousFrameTime, MAX_FRAME_DURATION);
        this.previousFrameTime = frameTime;
        this.accumulator += frameDuration;
        while (this.accumulator >= UPDATE_DURATION) {
            this.tileUpdate(UPDATE_DURATION);
            this.simulationTime += UPDATE_DURATION;
            this.accumulator -= UPDATE_DURATION;
        }
        this.offsetX = this.position * this.movementDirectionX * this.renderCellSize;
        this.offsetY = this.position * this.movementDirectionY * this.renderCellSize;
        this.render();
        requestAnimationFrame(t => this.loop(t));
    }
    rationalScale(x, height, flatness) {
        return height * (x / (flatness + x));
    }
    isMoving() {
        return this.movementDirectionX !== 0 || this.movementDirectionY !== 0;
    }
    resetMovement() {
        this.movementDirectionX = this.movementDirectionY = 0;
        this.position = this.speed = 0;
    }
    tileUpdate(deltaTime) {
        const centerX = () => this.selectionX + 0.5 + this.position * this.movementDirectionX;
        const centerY = () => this.selectionY + 0.5 + this.position * this.movementDirectionY;
        const shouldIndicateMovement = () => this.selection && (this.selectionX !== this.gridX || this.selectionY !== this.gridY);
        const getMovementDirection = () => {
            if (!shouldIndicateMovement())
                return new Vector(0, 0);
            const dx = this.levelX - (this.selectionX + 0.5);
            const dy = this.levelY - (this.selectionY + 0.5);
            if (dx + dy > 0)
                return dx - dy > 0 ? new Vector(1, 0) : new Vector(0, 1);
            return dx - dy > 0 ? new Vector(0, -1) : new Vector(-1, 0);
        };
        const trySetMovementDirection = () => {
            if (!this.leftDown) {
                this.resetMovement();
                return false;
            }
            const dir = getMovementDirection();
            this.movementDirectionX = dir.dx;
            this.movementDirectionY = dir.dy;
            if (!this.isMoving()) {
                this.resetMovement();
                return false;
            }
            this.movingCount = this.level.movingCount(this.selectionX, this.selectionY, this.movementDirectionX, this.movementDirectionY);
            console.log(this.movingCount);
            if (this.movingCount !== Number.POSITIVE_INFINITY) {
                if (this.speed < SPEED_MIN)
                    this.speed = SPEED_MIN;
                return true;
            }
            this.level.clearMove(this.selectionX, this.selectionY, this.movementDirectionX, this.movementDirectionY);
            this.resetMovement();
            return false;
        };
        if (this.leftDownStart) {
            this.activeLayer = this.level.activeLayer(this.gridX, this.gridY);
        }
        if (this.leftDownStart && !this.selection && this.level.isValidSelection(this.gridX, this.gridY)) {
            this.selection = true;
            this.selectionX = this.gridX;
            this.selectionY = this.gridY;
            this.resetMovement();
        }
        this.leftDownStart = false;
        if (!this.isMoving())
            trySetMovementDirection();
        if (this.isMoving()) {
            if (this.leftDown) {
                const offset = (this.levelX - centerX()) * this.movementDirectionX + (this.levelY - centerY()) * this.movementDirectionY;
                const acceleration = Math.abs(offset) * ACCELERATION * deltaTime;
                this.speed += acceleration;
            }
            const totalSpeed = this.speed;
            const drag = BASE_SPEED_FRACTION + DRAG_SPEED_FRACTION / this.movingCount;
            let remaining = this.rationalScale(totalSpeed * drag, SPEED_MAX, SPEED_FLATNESS);
            while (remaining > 0) {
                const distanceToComplete = 1 - this.position;
                if (remaining >= distanceToComplete) {
                    const direction = Direction.VectorToDirection(this.movementDirectionX, this.movementDirectionY);
                    const cwBit = Direction.Bits[Direction.Clockwise[direction]];
                    const ccwBit = Direction.Bits[Direction.CounterClockwise[direction]];
                    const oppBit = Direction.Bits[Direction.Opposite[direction]];
                    this.level.move(this.selectionX, this.selectionY, this.movementDirectionX, this.movementDirectionY, cwBit, ccwBit, oppBit);
                    remaining -= distanceToComplete;
                    this.position = 0;
                    const oldX = this.movementDirectionX;
                    const oldY = this.movementDirectionY;
                    this.selectionX += oldX;
                    this.selectionY += oldY;
                    if (!trySetMovementDirection())
                        remaining = 0;
                    else if (this.movementDirectionX !== oldX || this.movementDirectionY !== oldY)
                        this.speed *= DECAY_TURN_FRACTION;
                    else
                        this.speed *= DECAY_STRAIGHT_FRACTION;
                }
                else {
                    this.position += remaining;
                    remaining = 0;
                }
            }
        }
        if (!this.leftDown && !this.isMoving()) {
            this.selection = false;
            this.selectionX = this.selectionY = 0;
            this.resetMovement();
        }
    }
    render() {
        //this.gameContext.clearRect(0, 0, window.innerWidth, window.innerHeight)
        this.gameContext.fillStyle = '#1118';
        this.gameContext.fillRect(this.renderRect.x, this.renderRect.y, this.renderRect.w, this.renderRect.h);
        this.renderGrid();
        this.renderBlocks(Tile.Slider, '#ebb82d');
        this.renderBlocks(Tile.Wall, '#8c877a');
        this.renderSelection();
    }
    renderBlocks(type, color) {
        const radius = this.renderCellSize * BLOCK_RADIUS_FRACTION;
        this.gameContext.fillStyle = color;
        this.gameContext.beginPath();
        for (let i = 0; i < this.level.w; i++) {
            for (let j = 0; j < this.level.h; j++) {
                const block = this.level.tilesGrid[i][j];
                if (block.type !== type)
                    continue;
                const x = this.renderRect.x + i * this.renderCellSize + block.pushed * this.offsetX;
                const y = this.renderRect.y + j * this.renderCellSize + block.pushed * this.offsetY;
                this.gameContext.roundRect(x, y, this.renderCellSize, this.renderCellSize, radius);
            }
        }
        this.gameContext.fill();
    }
    renderSelection() {
        if (!this.selection)
            return;
        const radius = this.renderCellSize * BLOCK_RADIUS_FRACTION;
        this.gameContext.strokeStyle = 'white';
        this.gameContext.lineWidth = this.renderCellSize * SELECTION_LINE_WIDTH_FRACTION;
        this.gameContext.beginPath();
        const x = this.renderRect.x + this.selectionX * this.renderCellSize + this.offsetX;
        const y = this.renderRect.y + this.selectionY * this.renderCellSize + this.offsetY;
        this.gameContext.roundRect(x, y, this.renderCellSize, this.renderCellSize, radius);
        this.gameContext.stroke();
    }
    renderGrid() {
        this.gameContext.strokeStyle = '#fff2';
        this.gameContext.lineWidth = 1;
        this.gameContext.beginPath();
        const { x, y, w, h } = this.renderRect;
        for (let i = 0; i <= this.level.w; i++) {
            const gx = x + i * this.renderCellSize;
            this.gameContext.moveTo(gx, y);
            this.gameContext.lineTo(gx, y + h);
        }
        for (let j = 0; j < this.level.h; j++) {
            const gy = y + j * this.renderCellSize;
            this.gameContext.moveTo(x, gy);
            this.gameContext.lineTo(x + w, gy);
        }
        this.gameContext.stroke();
    }
    resize() {
        this.gameCanvas.width = window.innerWidth;
        this.gameCanvas.height = window.innerHeight;
        this.setDisplayVariables();
    }
    setDisplayVariables() {
        const verticalConstraint = window.innerWidth * this.level.h > window.innerHeight * this.level.w;
        this.renderCellSize = verticalConstraint ? window.innerHeight / this.level.h : window.innerWidth / this.level.w;
        this.renderRect.w = this.renderCellSize * this.level.w;
        this.renderRect.h = this.renderCellSize * this.level.h;
        this.renderRect.x = (window.innerWidth - this.renderRect.w) / 2;
        this.renderRect.y = (window.innerHeight - this.renderRect.h) / 2;
    }
    getLevelPosition(pos, origin, scale) {
        return (pos - origin) / scale;
    }
    getLevelX(x) {
        return this.getLevelPosition(x, this.renderRect.x, this.renderCellSize);
    }
    getLevelY(y) {
        return this.getLevelPosition(y, this.renderRect.y, this.renderCellSize);
    }
}
