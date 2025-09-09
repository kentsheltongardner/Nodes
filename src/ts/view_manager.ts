import AgentNode from './node.js'
import UpdateManager from './update_manager.js'

export default class ViewManager {
    public static readonly MAX_SCALE_POSITION       = 30
    public static readonly MIN_SCALE_POSITION       = 10
    public static readonly DEFAULT_SCALE_POSITION   = 20
    public static readonly SCALE_SPEED              = 0.03
    public static readonly CELL_SIZE                = 64

    private screenWidth            = 0
    private screenHeight           = 0

    private previousFocusX   = 0
    private previousFocusY   = 0
    private previousScale    = 1

    private focusX           = 0
    private focusY           = 0
    public scale            = 1

    private lagFocusX       = 0
    private lagFocusY       = 0
    public lagScale        = 1

    private selectedNode: AgentNode | null = null

    public scalePosition    = ViewManager.DEFAULT_SCALE_POSITION

    constructor(width: number, height: number) {
        this.setDisplayVariables(width, height)
    }

    public update() {
        this.lagFocusX  += (this.focusX - this.lagFocusX) * ViewManager.SCALE_SPEED * UpdateManager.UPDATE_MILLISECONDS
        this.lagFocusY  += (this.focusY - this.lagFocusY) * ViewManager.SCALE_SPEED * UpdateManager.UPDATE_MILLISECONDS
        this.lagScale   += (this.scale - this.lagScale) * ViewManager.SCALE_SPEED * UpdateManager.UPDATE_MILLISECONDS
    }

    public worldToScreenX(editorX: number, immediate: boolean = true) {
        return immediate
            ? this.worldToScreenPosition(editorX, this.screenWidth, this.focusX, this.scale)
            : this.worldToScreenPosition(editorX, this.screenWidth, this.lagFocusX, this.lagScale)
    }
    public worldToScreenY(editorY: number, immediate: boolean = true) {
        return immediate
            ? this.worldToScreenPosition(editorY, this.screenHeight, this.focusY, this.scale)
            : this.worldToScreenPosition(editorY, this.screenHeight, this.lagFocusY, this.lagScale)
    }
    public worldToScreenPosition(
        editorPosition: number, 
        screenSize: number,
        focus: number,
        scale: number
    ) {
        const offset            = editorPosition - focus
        const scaledOffset      = offset * scale
        const screenPosition    = screenSize / 2 + scaledOffset
        return screenPosition
    }



    public screenToWorldX(screenX: number, immediate: boolean = true) {
        return immediate
            ? this.screenToWorldPosition(screenX, this.screenWidth, this.focusX, this.scale)
            : this.screenToWorldPosition(screenX, this.screenWidth, this.lagFocusX, this.lagScale)
    }
    public screenToWorldY(screenY: number, immediate: boolean = true) {
        return immediate
            ? this.screenToWorldPosition(screenY, this.screenHeight, this.focusY, this.scale)
            : this.screenToWorldPosition(screenY, this.screenHeight, this.lagFocusY, this.lagScale)
    }
    public screenToWorldPosition(
        screenPosition: number, 
        screenSize: number, 
        focus: number,
        scale: number
    ) {
        const offset            = screenPosition - screenSize / 2
        const scaledOffset      = offset / scale
        const editorPosition    = focus + scaledOffset
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


    scalePositionToScale(scalePosition: number) {
        const factor = scalePosition / ViewManager.DEFAULT_SCALE_POSITION
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
        this.previousScale  = this.scale
        this.scale          = this.scalePositionToScale(this.scalePosition)

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
        const scaledDX  = dx / this.scale // TODO
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




    setDisplayVariables(screenWidth: number, screenHeight: number) {
        this.screenWidth  = screenWidth
        this.screenHeight = screenHeight
    }
    scaledCellSize(immediate: boolean) {
        return immediate
            ? this.scale * ViewManager.CELL_SIZE
            : this.lagScale * ViewManager.CELL_SIZE
    }
}

