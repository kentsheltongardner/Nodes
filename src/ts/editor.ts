import KeyboardManager from './keyboard_manager.js'
import Rect from './rect.js'
import ViewManager from './view_manager.js'
import UpdateManager from './update_manager.js'
import { lerp } from './utils.js'
import AgentNode from './node.js'


const TAU = 2 * Math.PI

export default class Editor {

    private readonly editorCanvas   = document.getElementById('editor-canvas') as HTMLCanvasElement
    private readonly editorContext  = this.editorCanvas.getContext('2d')!

    private keyboardManager = new KeyboardManager()
    private viewManager     = new ViewManager(this.editorCanvas.width, this.editorCanvas.height)
    private updateManager   = new UpdateManager()

    private nodes = [
        new AgentNode(0, 0, 100),
        new AgentNode(100, 100, 100),
        new AgentNode(200, 200, 100),
        new AgentNode(300, 300, 100),
        new AgentNode(400, 400, 100),
        new AgentNode(500, 500, 100),
        new AgentNode(600, 600, 100),
        new AgentNode(700, 700, 100),
    ]

    constructor() {
        this.bindEvents()
        this.resize()
        requestAnimationFrame(time => this.loop(time))
    }

    private bindEvents() {
        this.editorCanvas.addEventListener('mousedown',     e => this.viewManager.mouseDown(e, this.nodes))
        this.editorCanvas.addEventListener('mousemove',     e => this.viewManager.mouseMove(e))
        this.editorCanvas.addEventListener('mouseup',       e => this.viewManager.mouseUp(e))
        this.editorCanvas.addEventListener('wheel',         e => this.viewManager.wheelTurn(e) )
        this.editorCanvas.addEventListener('mouseleave',    () => this.viewManager.mouseLeave())
        this.editorCanvas.addEventListener('contextmenu',   e => e.preventDefault())

        window.addEventListener('resize', () => this.resize())
    }

    frame = 0
    private loop(time: number) {
        this.frame++
        this.updateManager.advanceFrame(time)
        for (let i = 0; i < this.updateManager.updateCount; i++) {
            this.viewManager.update()
        }
        this.render(this.updateManager.interpolation)
        requestAnimationFrame(t => this.loop(t))
    }



    private render(interpolation: number) {
        this.editorContext.clearRect(0, 0, window.innerWidth, window.innerHeight)

        this.editorContext.fillStyle = 'red'
        const scale = this.viewManager.currentScale()



        this.renderNodes()
        this.renderGridLines()
        this.renderSelection()
    }

    private renderNodes() {
        this.editorContext.beginPath()
        for (const node of this.nodes) {
            const screenX = this.viewManager.worldToScreenX(node.x)
            const screenY = this.viewManager.worldToScreenY(node.y)
            const screenRadius = node.radius * this.viewManager.currentScale()
            this.editorContext.moveTo(screenX + screenRadius, screenY)
            this.editorContext.arc(screenX, screenY, screenRadius, 0, TAU)
        }
        this.editorContext.strokeStyle = 'blue'
        this.editorContext.stroke()
    }

    private renderGridLines() {
        // screen x -> world x
        const left    = this.viewManager.screenToWorldX(0)
        const right   = this.viewManager.screenToWorldX(this.editorCanvas.width)
        const top     = this.viewManager.screenToWorldY(0)
        const bottom  = this.viewManager.screenToWorldY(this.editorCanvas.height)

        const screenWidth = this.editorCanvas.width
        const screenHeight = this.editorCanvas.height

        const x = Math.ceil(left / ViewManager.CELL_SIZE) * ViewManager.CELL_SIZE
        const y = Math.ceil(top / ViewManager.CELL_SIZE) * ViewManager.CELL_SIZE
        const increment = this.viewManager.scaledCellSize()

        let screenX = this.viewManager.worldToScreenX(x)
        let screenY = this.viewManager.worldToScreenY(y)
        
        this.editorContext.beginPath()
        while (screenX < screenWidth) {
            this.editorContext.moveTo(screenX, 0)
            this.editorContext.lineTo(screenX, screenHeight)
            screenX += increment
        }
        while (screenY < screenHeight) {
            this.editorContext.moveTo(0, screenY)
            this.editorContext.lineTo(screenWidth, screenY)
            screenY += increment
        }

        this.editorContext.strokeStyle = '#0002'
        this.editorContext.stroke()
    }

    private renderSelection() {

    }

    private resize() {
        const size = this.editorCanvas.getBoundingClientRect()
        this.editorCanvas.width = size.width
        this.editorCanvas.height = size.height
        this.viewManager.setDisplayVariables(this.editorCanvas.width, this.editorCanvas.height)
    }
}