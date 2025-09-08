import { lerp } from './utils.js';
export default class ViewManager {
    static MAX_SCALE_POSITION = 30;
    static MIN_SCALE_POSITION = 10;
    static DEFAULT_SCALE_POSITION = 20;
    static SCALE_SPEED = 0.01;
    static CELL_SIZE = 64;
    width = 0;
    height = 0;
    previousFocusX = 0;
    previousFocusY = 0;
    previousScale = 1;
    focusX = 0;
    focusY = 0;
    scale = 1;
    selectedNode = null;
    scalePosition = ViewManager.DEFAULT_SCALE_POSITION;
    constructor(width, height) {
        this.setDisplayVariables(width, height);
    }
    update() {
        // TODO?
    }
    worldToScreenX(editorX) {
        return this.worldToScreenPosition(editorX, this.width, this.previousFocusX, this.focusX);
    }
    worldToScreenY(editorY) {
        return this.worldToScreenPosition(editorY, this.height, this.previousFocusY, this.focusY);
    }
    worldToScreenPosition(editorPosition, screenSize, previousFocus, focus) {
        const offset = editorPosition - lerp(previousFocus, focus, 1);
        const scaledOffset = offset * lerp(this.previousScale, this.scale, 1);
        const screenPosition = screenSize / 2 + scaledOffset;
        return screenPosition;
    }
    screenToWorldX(screenX) {
        return this.screenToWorldPosition(screenX, this.width, this.previousFocusX, this.focusX);
    }
    screenToWorldY(screenY) {
        return this.screenToWorldPosition(screenY, this.height, this.previousFocusY, this.focusY);
    }
    screenToWorldPosition(screenPosition, screenSize, previousFocus, focus) {
        const offset = screenPosition - screenSize / 2;
        const scaledOffset = offset / lerp(this.previousScale, this.scale, 1);
        const editorPosition = lerp(previousFocus, focus, 1) + scaledOffset;
        return editorPosition;
    }
    leftDown = false;
    rightDown = false;
    screenX = 0;
    screenY = 0;
    x = 0;
    y = 0;
    leftDownX = 0;
    leftDownY = 0;
    intScaleToScale(intScale) {
        const factor = intScale / ViewManager.DEFAULT_SCALE_POSITION;
        return factor * factor * factor;
    }
    wheelTurn(e) {
        const direction = -Math.sign(e.deltaY);
        if (direction === 0)
            return;
        if (direction === 1
            && this.scalePosition === ViewManager.MAX_SCALE_POSITION)
            return;
        if (direction === -1
            && this.scalePosition === ViewManager.MIN_SCALE_POSITION)
            return;
        // need to account for different center
        // What is my world position now?
        // What will my world position be?
        // Change the target center accordingly
        const focusX = this.screenToWorldX(this.screenX);
        const focusY = this.screenToWorldY(this.screenY);
        this.scalePosition = this.scalePosition + direction;
        const factor = this.scalePosition / ViewManager.DEFAULT_SCALE_POSITION;
        this.previousScale = this.scale;
        this.scale = factor * factor * factor;
        const scaledFocusX = this.screenToWorldX(this.screenX);
        const scaledFocusY = this.screenToWorldY(this.screenY);
        const dx = scaledFocusX - focusX;
        const dy = scaledFocusY - focusY;
        this.previousFocusX = this.focusX;
        this.previousFocusY = this.focusY;
        this.focusX = this.focusX - dx;
        this.focusY = this.focusY - dy;
    }
    mouseDown(e, nodes) {
        if (e.button === 0) {
            this.leftDown = true;
            const x = this.screenToWorldX(e.offsetX);
            const y = this.screenToWorldY(e.offsetY);
            for (const node of nodes) {
                if (node.contains(x, y)) {
                    this.selectedNode = node;
                    break;
                }
            }
        }
        else if (e.button === 2) {
            this.rightDown = true;
        }
    }
    mouseMove(e) {
        const dx = e.offsetX - this.screenX;
        const dy = e.offsetY - this.screenY;
        const scaledDX = dx / this.scale;
        const scaledDY = dy / this.scale;
        if (this.rightDown) {
            this.focusX = this.focusX - scaledDX;
            this.focusY = this.focusY - scaledDY;
        }
        if (this.selectedNode !== null) {
            this.selectedNode.x = this.selectedNode.x + scaledDX;
            this.selectedNode.y = this.selectedNode.y + scaledDY;
        }
        this.screenX = e.offsetX;
        this.screenY = e.offsetY;
    }
    mouseUp(e) {
        if (e.button === 0) {
            this.selectedNode = null;
            this.leftDown = false;
        }
        else if (e.button === 2) {
            this.rightDown = false;
        }
    }
    mouseLeave() {
        this.leftDown = false;
        this.rightDown = false;
    }
    setDisplayVariables(width, height) {
        this.width = width;
        this.height = height;
    }
    scaledCellSize() {
        return this.scale * ViewManager.CELL_SIZE;
    }
    currentScale() {
        return this.scale;
    }
    currentFocusX() {
        return this.focusX;
    }
    currentFocusY() {
        return this.focusY;
    }
}
