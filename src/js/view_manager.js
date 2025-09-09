import UpdateManager from './update_manager.js';
export default class ViewManager {
    static MAX_SCALE_POSITION = 30;
    static MIN_SCALE_POSITION = 10;
    static DEFAULT_SCALE_POSITION = 20;
    static SCALE_SPEED = 0.03;
    static CELL_SIZE = 64;
    screenWidth = 0;
    screenHeight = 0;
    previousFocusX = 0;
    previousFocusY = 0;
    previousScale = 1;
    focusX = 0;
    focusY = 0;
    scale = 1;
    lagFocusX = 0;
    lagFocusY = 0;
    lagScale = 1;
    selectedNode = null;
    scalePosition = ViewManager.DEFAULT_SCALE_POSITION;
    constructor(width, height) {
        this.setDisplayVariables(width, height);
    }
    update() {
        this.lagFocusX += (this.focusX - this.lagFocusX) * ViewManager.SCALE_SPEED * UpdateManager.UPDATE_MILLISECONDS;
        this.lagFocusY += (this.focusY - this.lagFocusY) * ViewManager.SCALE_SPEED * UpdateManager.UPDATE_MILLISECONDS;
        this.lagScale += (this.scale - this.lagScale) * ViewManager.SCALE_SPEED * UpdateManager.UPDATE_MILLISECONDS;
    }
    worldToScreenX(editorX, immediate = true) {
        return immediate
            ? this.worldToScreenPosition(editorX, this.screenWidth, this.focusX, this.scale)
            : this.worldToScreenPosition(editorX, this.screenWidth, this.lagFocusX, this.lagScale);
    }
    worldToScreenY(editorY, immediate = true) {
        return immediate
            ? this.worldToScreenPosition(editorY, this.screenHeight, this.focusY, this.scale)
            : this.worldToScreenPosition(editorY, this.screenHeight, this.lagFocusY, this.lagScale);
    }
    worldToScreenPosition(editorPosition, screenSize, focus, scale) {
        const offset = editorPosition - focus;
        const scaledOffset = offset * scale;
        const screenPosition = screenSize / 2 + scaledOffset;
        return screenPosition;
    }
    screenToWorldX(screenX, immediate = true) {
        return immediate
            ? this.screenToWorldPosition(screenX, this.screenWidth, this.focusX, this.scale)
            : this.screenToWorldPosition(screenX, this.screenWidth, this.lagFocusX, this.lagScale);
    }
    screenToWorldY(screenY, immediate = true) {
        return immediate
            ? this.screenToWorldPosition(screenY, this.screenHeight, this.focusY, this.scale)
            : this.screenToWorldPosition(screenY, this.screenHeight, this.lagFocusY, this.lagScale);
    }
    screenToWorldPosition(screenPosition, screenSize, focus, scale) {
        const offset = screenPosition - screenSize / 2;
        const scaledOffset = offset / scale;
        const editorPosition = focus + scaledOffset;
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
    scalePositionToScale(scalePosition) {
        const factor = scalePosition / ViewManager.DEFAULT_SCALE_POSITION;
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
        this.previousScale = this.scale;
        this.scale = this.scalePositionToScale(this.scalePosition);
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
        const scaledDX = dx / this.scale; // TODO
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
    setDisplayVariables(screenWidth, screenHeight) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }
    scaledCellSize(immediate) {
        return immediate
            ? this.scale * ViewManager.CELL_SIZE
            : this.lagScale * ViewManager.CELL_SIZE;
    }
}
