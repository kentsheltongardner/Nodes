export default class AgentNode {
    constructor(
        public x: number,
        public y: number,
        public radius: number,
    ) {

    }

    contains(x: number, y: number) {
        const dx = x - this.x
        const dy = y - this.y
        return dx * dx + dy * dy <= this.radius * this.radius
    }
}