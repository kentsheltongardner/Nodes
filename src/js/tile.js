export default class Tile {
    type;
    connections;
    static None = 0;
    static Slider = 1;
    static Wall = 2;
    pushed = 0;
    constructor(type, connections) {
        this.type = type;
        this.connections = connections;
    }
}
