import KeyboardManager from './keyboard_manager.js';
import Rect from './rect.js';
import ViewManager from './view_manager.js';
import UpdateManager from './update_manager.js';
import { lerp } from './utils.js';
export default class Editor {
    editorCanvas = document.getElementById('game-canvas');
    editorContext = this.editorCanvas.getContext('2d');
    renderCellSize = 0;
    renderRect = new Rect(0, 0, 0, 0);
    keyboardManager = new KeyboardManager();
    viewManager = new ViewManager(this.editorCanvas);
    updateManager = new UpdateManager();
    constructor() {
        this.bindEvents();
        this.resize();
        requestAnimationFrame(time => this.loop(time));
    }
    bindEvents() {
        this.editorCanvas.addEventListener('mousedown', e => this.viewManager.mouseDown(e));
        this.editorCanvas.addEventListener('mousemove', e => this.viewManager.mouseMove(e));
        this.editorCanvas.addEventListener('mouseup', e => this.viewManager.mouseUp(e));
        this.editorCanvas.addEventListener('wheel', e => this.viewManager.wheelTurn(e));
        this.editorCanvas.addEventListener('mouseleave', () => this.viewManager.mouseLeave());
        this.editorCanvas.addEventListener('contextmenu', e => e.preventDefault());
        window.addEventListener('resize', () => this.resize());
    }
    frame = 0;
    loop(time) {
        this.frame++;
        this.updateManager.advanceFrame(time);
        this.prevX = this.x;
        for (let i = 0; i < this.updateManager.updateCount; i++) {
            this.viewManager.update();
            this.prevX = this.x;
            this.x += 1;
        }
        this.x2++;
        this.render(this.updateManager.interpolation);
        requestAnimationFrame(t => this.loop(t));
    }
    prevX = 0;
    x = 0;
    x2 = 0;
    render(interpolation) {
        this.editorContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.editorContext.fillStyle = 'red';
        const x = lerp(this.prevX, this.x, interpolation);
        //const scale = lerp(this.viewManager.previousScale, this.viewManager.scale, interpolation)
        const scale = this.viewManager.scale;
        this.editorContext.fillRect(x, 0, 90 * scale, 90 * scale);
        this.editorContext.fillRect(this.x, 200, 90, 90);
        this.editorContext.fillRect(this.x2, 300, 90, 90);
        this.editorContext.fillStyle = 'blue';
        const scaledX = this.viewManager.worldToScreenX(50);
        const scaledY = this.viewManager.worldToScreenY(-20);
        this.editorContext.fillRect(scaledX, scaledY, 90 * this.viewManager.scale, 90 * this.viewManager.scale);
        console.log();
        this.renderGrid();
        this.renderSelection();
    }
    renderGridLines(interpolation) {
        // const xStart = 
        // const yStart = 
        // const cellSize = 
        // for () {
        // }
        // for () {
        // }
    }
    renderSelection() {
        this.editorContext.beginPath();
        this.editorContext.stroke();
    }
    renderGrid() {
        this.editorContext.strokeStyle = '#fff2';
        this.editorContext.lineWidth = 1;
        this.editorContext.beginPath();
        this.editorContext.stroke();
    }
    resize() {
        // set display variables in viewManager
        const size = this.editorCanvas.getBoundingClientRect();
        this.editorCanvas.width = size.width;
        this.editorCanvas.height = size.height;
        this.setDisplayVariables();
    }
    setDisplayVariables() {
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
