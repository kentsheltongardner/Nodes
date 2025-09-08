import AgentNode from './node.js'
import { lerp } from './utils.js'

export default class ViewManager {
    public static readonly MAX_SCALE_POSITION       = 30
    public static readonly MIN_SCALE_POSITION       = 10
    public static readonly DEFAULT_SCALE_POSITION   = 20
    public static readonly SCALE_SPEED              = 0.01
    public static readonly CELL_SIZE                = 64

    private width            = 0
    private height           = 0

    private previousFocusX   = 0
    private previousFocusY   = 0
    private previousScale    = 1

    private focusX           = 0
    private focusY           = 0
    private scale            = 1

    private selectedNode: AgentNode | null = null

    public scalePosition    = ViewManager.DEFAULT_SCALE_POSITION

    constructor(width: number, height: number) {
        this.setDisplayVariables(width, height)
    }

    public update() {
        // TODO?
    }

    public worldToScreenX(editorX: number) {
        return this.worldToScreenPosition(editorX, this.width, this.previousFocusX, this.focusX)
    }
    public worldToScreenY(editorY: number) {
        return this.worldToScreenPosition(editorY, this.height, this.previousFocusY, this.focusY)
    }
    public worldToScreenPosition(
        editorPosition: number, 
        screenSize: number,
        previousFocus: number,
        focus: number,
    ) {
        const offset            = editorPosition - lerp(previousFocus, focus, 1)
        const scaledOffset      = offset * lerp(this.previousScale, this.scale, 1)
        const screenPosition    = screenSize / 2 + scaledOffset
        return screenPosition
    }

    public screenToWorldX(screenX: number) {
        return this.screenToWorldPosition(screenX, this.width, this.previousFocusX, this.focusX)
    }
    public screenToWorldY(screenY: number) {
        return this.screenToWorldPosition(screenY, this.height, this.previousFocusY, this.focusY)
    }
    public screenToWorldPosition(
        screenPosition: number, 
        screenSize: number, 
        previousFocus: number,
        focus: number,
    ) {
        const offset            = screenPosition - screenSize / 2
        const scaledOffset      = offset / lerp(this.previousScale, this.scale, 1)
        const editorPosition    = lerp(previousFocus, focus, 1) + scaledOffset
        return editorPosition
    }


    public leftDown     = false
    public rightDown    = false
    public screenX      = 0
    public screenY      = 0
    public x            = 0
    public y            = 0
    public leftDownX    = 0
    public leftDownY    = 0


    intScaleToScale(intScale: number) {
        const factor = intScale / ViewManager.DEFAULT_SCALE_POSITION
        return factor * factor * factor
    }

    wheelTurn(e: WheelEvent) {
        const direction = -Math.sign(e.deltaY)
        if (direction === 0) return

        if (direction === 1 
            && this.scalePosition === ViewManager.MAX_SCALE_POSITION) return
        if (direction === -1 
            && this.scalePosition === ViewManager.MIN_SCALE_POSITION) return

        // need to account for different center
        // What is my world position now?
        // What will my world position be?
        // Change the target center accordingly

        const focusX        = this.screenToWorldX(this.screenX)
        const focusY        = this.screenToWorldY(this.screenY)

        this.scalePosition  = this.scalePosition + direction
        const factor        = this.scalePosition / ViewManager.DEFAULT_SCALE_POSITION
        this.previousScale  = this.scale
        this.scale          = factor * factor * factor

        const scaledFocusX  = this.screenToWorldX(this.screenX)
        const scaledFocusY  = this.screenToWorldY(this.screenY)

        const dx            = scaledFocusX - focusX
        const dy            = scaledFocusY - focusY

        this.previousFocusX = this.focusX
        this.previousFocusY = this.focusY
        this.focusX         = this.focusX - dx
        this.focusY         = this.focusY - dy
    }
    mouseDown(e: MouseEvent, nodes: AgentNode[]) {
        if (e.button === 0) {
            this.leftDown = true
            const x = this.screenToWorldX(e.offsetX)
            const y = this.screenToWorldY(e.offsetY)
            for (const node of nodes) {
                if (node.contains(x, y)) {
                    this.selectedNode = node
                    break
                }
            }
        } else if (e.button === 2) {
            this.rightDown = true
        }
    }
    mouseMove(e: MouseEvent) {
        const dx        = e.offsetX - this.screenX
        const dy        = e.offsetY - this.screenY
        const scaledDX  = dx / this.scale
        const scaledDY  = dy / this.scale

        if (this.rightDown) {
            this.focusX     = this.focusX - scaledDX
            this.focusY     = this.focusY - scaledDY
        }
        if (this.selectedNode !== null) {
            this.selectedNode.x = this.selectedNode.x + scaledDX
            this.selectedNode.y = this.selectedNode.y + scaledDY
        }

        this.screenX = e.offsetX
        this.screenY = e.offsetY
    }
    mouseUp(e: MouseEvent) {
        if (e.button === 0) {
            this.selectedNode   = null
            this.leftDown       = false
        }
        else if (e.button === 2) {
            this.rightDown      = false
        }
    }
    mouseLeave() {
        this.leftDown   = false
        this.rightDown  = false
    }




    setDisplayVariables(width: number, height: number) {
        this.width  = width
        this.height = height
    }
    scaledCellSize() {
        return this.scale * ViewManager.CELL_SIZE
    }

    currentScale() {
        return this.scale
    }
    currentFocusX() {
        return this.focusX
    }
    currentFocusY() {
        return this.focusY
    }
}