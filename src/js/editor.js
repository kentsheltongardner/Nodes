import ViewManager from './view_manager.js';
import UpdateManager from './update_manager.js';
import AgentNode from './node.js';
const TAU = 2 * Math.PI;
export default class Editor {
    editorCanvas = document.getElementById('editor-canvas');
    editorContext = this.editorCanvas.getContext('2d');
    viewManager = new ViewManager(this.editorCanvas.width, this.editorCanvas.height);
    updateManager = new UpdateManager();
    nodes = [
        new AgentNode(0, 0, 100),
        new AgentNode(100, 100, 100),
        new AgentNode(200, 200, 100),
        new AgentNode(300, 300, 100),
        new AgentNode(400, 400, 100),
        new AgentNode(500, 500, 100),
        new AgentNode(600, 600, 100),
        new AgentNode(700, 700, 100),
    ];
    constructor() {
        this.bindEvents();
        this.resize();
        requestAnimationFrame(time => this.loop(time));
    }
    bindEvents() {
        this.editorCanvas.addEventListener('mousedown', e => this.viewManager.mouseDown(e, this.nodes));
        this.editorCanvas.addEventListener('mousemove', e => this.viewManager.mouseMove(e));
        this.editorCanvas.addEventListener('mouseup', e => this.viewManager.mouseUp(e));
        this.editorCanvas.addEventListener('wheel', e => this.viewManager.wheelTurn(e));
        this.editorCanvas.addEventListener('mouseleave', () => this.viewManager.mouseLeave());
        this.editorCanvas.addEventListener('contextmenu', e => e.preventDefault());
        window.addEventListener('resize', () => this.resize());
    }
    loop(time) {
        this.updateManager.advanceFrame(time);
        for (let i = 0; i < this.updateManager.updateCount; i++) {
            this.viewManager.update();
        }
        this.render(this.updateManager.interpolation);
        requestAnimationFrame(t => this.loop(t));
    }
    render(interpolation) {
        this.editorContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.renderNodes();
        this.renderGridLines();
    }
    renderNodes() {
        this.editorContext.beginPath();
        for (const node of this.nodes) {
            const screenX = this.viewManager.worldToScreenX(node.x, false);
            const screenY = this.viewManager.worldToScreenY(node.y, false);
            const screenRadius = node.radius * this.viewManager.lagScale;
            this.editorContext.moveTo(screenX + screenRadius, screenY);
            this.editorContext.arc(screenX, screenY, screenRadius, 0, TAU);
        }
        this.editorContext.strokeStyle = 'blue';
        this.editorContext.stroke();
    }
    renderGridLines() {
        const left = this.viewManager.screenToWorldX(0, false);
        const top = this.viewManager.screenToWorldY(0, false);
        const screenWidth = this.editorCanvas.width;
        const screenHeight = this.editorCanvas.height;
        const x = Math.ceil(left / ViewManager.CELL_SIZE) * ViewManager.CELL_SIZE;
        const y = Math.ceil(top / ViewManager.CELL_SIZE) * ViewManager.CELL_SIZE;
        const increment = this.viewManager.scaledCellSize(false);
        let screenX = this.viewManager.worldToScreenX(x, false);
        let screenY = this.viewManager.worldToScreenY(y, false);
        this.editorContext.beginPath();
        while (screenX < screenWidth) {
            this.editorContext.moveTo(screenX, 0);
            this.editorContext.lineTo(screenX, screenHeight);
            screenX += increment;
        }
        while (screenY < screenHeight) {
            this.editorContext.moveTo(0, screenY);
            this.editorContext.lineTo(screenWidth, screenY);
            screenY += increment;
        }
        this.editorContext.strokeStyle = '#0002';
        this.editorContext.stroke();
    }
    resize() {
        const size = this.editorCanvas.getBoundingClientRect();
        this.editorCanvas.width = size.width;
        this.editorCanvas.height = size.height;
        this.viewManager.setDisplayVariables(this.editorCanvas.width, this.editorCanvas.height);
    }
}
