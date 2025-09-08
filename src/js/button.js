export default class Button {
    type;
    connections;
    fixed;
    static Unary = 1;
    static Binary = 2;
    static Ternary = 3;
    static Quaternary = 4;
    constructor(type, connections, fixed = false) {
        this.type = type;
        this.connections = connections;
        this.fixed = fixed;
    }
}
