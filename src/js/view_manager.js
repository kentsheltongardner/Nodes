// import UpdateManager from './update_manager.js'
// export default class ViewManager {
//     public static readonly MAX_SCALE_POSITION        = 30
//     public static readonly MIN_SCALE_POSITION        = 10
//     public static readonly DEFAULT_SCALE_POSITION    = 20
//     public static readonly SCALE_SPEED  = 0.01
//     public static readonly CELL_SIZE    = 64
//     public focusX           = 0
//     public focusY           = 0
//     public targetFocusX     = 0
//     public targetFocusY     = 0
//     public previousScale    = 1
//     public scalePosition    = ViewManager.DEFAULT_SCALE_POSITION
//     public scale            = 1 // 1 editor unit is represented by how many screen pixels
//     public targetScale      = 1
//     constructor(public canvas: HTMLCanvasElement) {}
//     public update() {
//         this.previousScale = this.scale
//         this.scale += (this.targetScale - this.scale) * ViewManager.SCALE_SPEED * UpdateManager.UPDATE_MILLISECONDS
//         this.focusX += (this.targetFocusX - this.focusX) * ViewManager.SCALE_SPEED * UpdateManager.UPDATE_MILLISECONDS
//         this.focusY += (this.targetFocusY - this.focusY) * ViewManager.SCALE_SPEED * UpdateManager.UPDATE_MILLISECONDS
//     }
//     public scaledCellSize() {
//         return this.scale * ViewManager.CELL_SIZE
//     }
//     public worldToScreenX(editorX: number, scale: number) {
//         return this.worldToScreenPosition(editorX, this.canvas.width, this.focusX, scale)
//     }
//     public worldToScreenY(editorY: number, scale: number) {
//         return this.worldToScreenPosition(editorY, this.canvas.height, this.focusY, scale)
//     }
//     public worldToScreenPosition(
//         editorPosition: number, 
//         screenSize: number, 
//         focus: number, 
//         scale: number
//     ) {
//         // Should probably use a lerped scale here
//         const offset            = editorPosition - focus
//         const scaledOffset      = offset * scale
//         const screenPosition    = screenSize / 2 + scaledOffset
//         return screenPosition
//     }
//     public screenToWorldX(screenX: number, scale: number) {
//         return this.screenToWorldPosition(screenX, this.canvas.width, this.focusX, scale)
//     }
//     public screenToWorldY(screenY: number, scale: number) {
//         return this.screenToWorldPosition(screenY, this.canvas.height, this.focusY, scale)
//     }
//     public screenToWorldPosition(
//         screenPosition: number, 
//         screenSize: number, 
//         focus: number, 
//         scale: number) {
//         const offset            = screenPosition - screenSize / 2
//         const scaledOffset      = offset / scale
//         const editorPosition    = focus + scaledOffset
//         return editorPosition
//     }
//     public leftDown     = false
//     public rightDown    = false
//     public screenX      = 0
//     public screenY      = 0
//     public x            = 0
//     public y            = 0
//     public leftDownX    = 0
//     public leftDownY    = 0
//     intScaleToScale(intScale: number) {
//         const factor = intScale / ViewManager.DEFAULT_SCALE_POSITION
//         return factor * factor * factor
//     }
//     wheelTurn(e: WheelEvent) {
//         const direction = -Math.sign(e.deltaY)
//         if (direction === 0) return
//         if (direction === 1 
//             && this.scalePosition === ViewManager.MAX_SCALE_POSITION) return
//         if (direction === -1 
//             && this.scalePosition === ViewManager.MIN_SCALE_POSITION) return
//         // need to account for different center
//         // What is my world position now?
//         // What will my world position be?
//         // Change the target center accordingly
//         this.scalePosition  = this.scalePosition + direction
//         const factor        = this.scalePosition / ViewManager.DEFAULT_SCALE_POSITION
//         this.targetScale    = factor * factor * factor
//         const focusX        = this.screenToWorldX(this.screenX, this.scale)
//         const focusY        = this.screenToWorldY(this.screenY, this.scale)
//         const scaledFocusX  = this.screenToWorldX(this.screenX, this.targetScale)
//         const scaledFocusY  = this.screenToWorldY(this.screenY, this.targetScale)
//         const dx            = scaledFocusX - focusX
//         const dy            = scaledFocusY - focusY
//         this.targetFocusX   = this.targetFocusX - dx / 2
//         this.targetFocusY   = this.targetFocusY - dy / 2
//     }
//     mouseDown(e: MouseEvent) {
//         if      (e.button === 0) this.leftDown   = true
//         else if (e.button === 2) this.rightDown  = true
//     }
//     mouseMove(e: MouseEvent) {
//         const dx = e.offsetX - this.screenX
//         const dy = e.offsetY - this.screenY
//         if (this.leftDown) {
//             const scaledDX = dx / this.scale
//             const scaledDY = dy / this.scale
//             //this.focusX -= scaledDX
//             //this.focusY -= scaledDY
//             this.targetFocusX -= scaledDX
//             this.targetFocusY -= scaledDY
//         }
//         this.screenX = e.offsetX
//         this.screenY = e.offsetY
//     }
//     mouseUp(e: MouseEvent) {
//         if      (e.button === 0) this.leftDown   = false
//         else if (e.button === 2) this.rightDown  = false
//     }
//     mouseLeave() {
//         this.leftDown   = false
//         this.rightDown  = false
//     }
// }
// import UpdateManager from './update_manager.js'
// export default class ViewManager {
//     public static readonly MAX_SCALE_POSITION        = 30
//     public static readonly MIN_SCALE_POSITION        = 10
//     public static readonly DEFAULT_SCALE_POSITION    = 20
//     public static readonly SCALE_SPEED  = 0.01
//     public static readonly CELL_SIZE    = 64
//     public previousFocusX   = 0
//     public previousFocusY   = 0
//     public previousScale    = 1
//     public targetFocusX     = 0
//     public targetFocusY     = 0
//     public scalePosition    = ViewManager.DEFAULT_SCALE_POSITION
//     public targetScale      = 1
//     public previousScale    = 1
//     public scale            = 1
//     public focusX           = 0
//     public focusY           = 0
//     public previousFocusX   = 0
//     public previousFocusY   = 0
//     constructor(public canvas: HTMLCanvasElement) {}
//     public update() {
//         this.previousScale  = this.scale
//         this.previousFocusX = this.focusX
//         this.previousFocusY = this.focusY
//         this.scale  += (this.targetScale - this.scale) * ViewManager.SCALE_SPEED * UpdateManager.UPDATE_MILLISECONDS
//         this.focusX += (this.targetFocusX - this.focusX) * ViewManager.SCALE_SPEED * UpdateManager.UPDATE_MILLISECONDS
//         this.focusY += (this.targetFocusY - this.focusY) * ViewManager.SCALE_SPEED * UpdateManager.UPDATE_MILLISECONDS
//     }
//     public worldToScreenX(editorX: number, focusX: number, scale: number) {
//         return this.worldToScreenPosition(editorX, this.canvas.width, focusX, scale)
//     }
//     public worldToScreenY(editorY: number, focusY: number, scale: number) {
//         return this.worldToScreenPosition(editorY, this.canvas.height, focusY, scale)
//     }
//     public worldToScreenPosition(
//         editorPosition: number, 
//         screenSize: number, 
//         focus: number,
//         scale: number
//     ) {
//         const offset            = editorPosition - focus
//         const scaledOffset      = offset * scale
//         const screenPosition    = screenSize / 2 + scaledOffset
//         return screenPosition
//     }
//     public screenToWorldX(screenX: number) {
//         return this.screenToWorldPosition(screenX, this.canvas.width, this.targetFocusX)
//     }
//     public screenToWorldY(screenY: number) {
//         return this.screenToWorldPosition(screenY, this.canvas.height, this.targetFocusY)
//     }
//     public screenToWorldPosition(
//         screenPosition: number, 
//         screenSize: number, 
//         focus: number) {
//         const offset            = screenPosition - screenSize / 2
//         const scaledOffset      = offset / this.targetScale
//         const editorPosition    = focus + scaledOffset
//         return editorPosition
//     }
//     public leftDown     = false
//     public rightDown    = false
//     public screenX      = 0
//     public screenY      = 0
//     public x            = 0
//     public y            = 0
//     public leftDownX    = 0
//     public leftDownY    = 0
//     intScaleToScale(intScale: number) {
//         const factor = intScale / ViewManager.DEFAULT_SCALE_POSITION
//         return factor * factor * factor
//     }
//     wheelTurn(e: WheelEvent) {
//         const direction = -Math.sign(e.deltaY)
//         if (direction === 0) return
//         if (direction === 1 
//             && this.scalePosition === ViewManager.MAX_SCALE_POSITION) return
//         if (direction === -1 
//             && this.scalePosition === ViewManager.MIN_SCALE_POSITION) return
//         // need to account for different center
//         // What is my world position now?
//         // What will my world position be?
//         // Change the target center accordingly
//         const focusX        = this.screenToWorldX(this.screenX)
//         const focusY        = this.screenToWorldY(this.screenY)
//         this.scalePosition  = this.scalePosition + direction
//         const factor        = this.scalePosition / ViewManager.DEFAULT_SCALE_POSITION
//         this.targetScale    = factor * factor * factor
//         const scaledFocusX  = this.screenToWorldX(this.screenX)
//         const scaledFocusY  = this.screenToWorldY(this.screenY)
//         const dx            = scaledFocusX - focusX
//         const dy            = scaledFocusY - focusY
//         this.targetFocusX   = this.targetFocusX - dx
//         this.targetFocusY   = this.targetFocusY - dy
//     }
//     mouseDown(e: MouseEvent) {
//         if      (e.button === 0) this.leftDown   = true
//         else if (e.button === 2) this.rightDown  = true
//     }
//     mouseMove(e: MouseEvent) {
//         const dx = e.offsetX - this.screenX
//         const dy = e.offsetY - this.screenY
//         if (this.leftDown) {
//             const scaledDX = dx / this.targetScale
//             const scaledDY = dy / this.targetScale
//             //this.focusX -= scaledDX
//             //this.focusY -= scaledDY
//             this.targetFocusX -= scaledDX
//             this.targetFocusY -= scaledDY
//         }
//         this.screenX = e.offsetX
//         this.screenY = e.offsetY
//     }
//     mouseUp(e: MouseEvent) {
//         if      (e.button === 0) this.leftDown   = false
//         else if (e.button === 2) this.rightDown  = false
//     }
//     mouseLeave() {
//         this.leftDown   = false
//         this.rightDown  = false
//     }
// }
import UpdateManager from './update_manager.js';
import { lerp } from './utils.js';
export default class ViewManager {
    canvas;
    static MAX_SCALE_POSITION = 30;
    static MIN_SCALE_POSITION = 10;
    static DEFAULT_SCALE_POSITION = 20;
    static SCALE_SPEED = 0.01;
    static CELL_SIZE = 64;
    previousFocusX = 0;
    previousFocusY = 0;
    previousScale = 1;
    focusX = 0;
    focusY = 0;
    scale = 1;
    asymptote = 0;
    scalePosition = ViewManager.DEFAULT_SCALE_POSITION;
    constructor(canvas) {
        this.canvas = canvas;
    }
    update() {
        this.asymptote += 1 - this.asymptote * ViewManager.SCALE_SPEED * UpdateManager.UPDATE_MILLISECONDS;
    }
    worldToScreenX(editorX) {
        return this.worldToScreenPosition(editorX, this.canvas.width, this.focusX, this.previousFocusX);
    }
    worldToScreenY(editorY) {
        return this.worldToScreenPosition(editorY, this.canvas.height, this.focusY, this.previousFocusY);
    }
    worldToScreenPosition(editorPosition, screenSize, focus, previousFocus) {
        const offset = editorPosition - lerp(previousFocus, focus, this.asymptote);
        const scaledOffset = offset * lerp(this.previousScale, this.scale, this.asymptote);
        const screenPosition = screenSize / 2 + scaledOffset;
        return screenPosition;
    }
    screenToWorldX(screenX) {
        return this.screenToWorldPosition(screenX, this.canvas.width);
    }
    screenToWorldY(screenY) {
        return this.screenToWorldPosition(screenY, this.canvas.height);
    }
    screenToWorldPosition(screenPosition, screenSize) {
        const offset = screenPosition - screenSize / 2;
        const scaledOffset = offset / lerp(this.previousScale, this.scale, this.asymptote);
        const editorPosition = lerp(this.previousFocusX, this.focusX, this.asymptote) + scaledOffset;
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
    mouseDown(e) {
        if (e.button === 0)
            this.leftDown = true;
        else if (e.button === 2)
            this.rightDown = true;
    }
    mouseMove(e) {
        const dx = e.offsetX - this.screenX;
        const dy = e.offsetY - this.screenY;
        if (this.leftDown) {
            const scaledDX = dx / this.scale;
            const scaledDY = dy / this.scale;
            //this.focusX -= scaledDX
            //this.focusY -= scaledDY
            this.focusX -= scaledDX;
            this.focusY -= scaledDY;
        }
        this.screenX = e.offsetX;
        this.screenY = e.offsetY;
    }
    mouseUp(e) {
        if (e.button === 0)
            this.leftDown = false;
        else if (e.button === 2)
            this.rightDown = false;
    }
    mouseLeave() {
        this.leftDown = false;
        this.rightDown = false;
    }
}
