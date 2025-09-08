import Vector from './vector.js';
export default class Direction {
    static NW = 0;
    static N = 1;
    static NE = 2;
    static W = 3;
    static None = 4;
    static E = 5;
    static SW = 6;
    static S = 7;
    static SE = 8;
    static BitE = 0b00000001;
    static BitS = 0b00000010;
    static BitW = 0b00000100;
    static BitN = 0b00001000;
    static BitSE = 0b00010000;
    static BitSW = 0b00100000;
    static BitNW = 0b01000000;
    static BitNE = 0b10000000;
    static Bits = [
        Direction.BitNW,
        Direction.BitN,
        Direction.BitNE,
        Direction.BitW,
        0,
        Direction.BitE,
        Direction.BitSW,
        Direction.BitS,
        Direction.BitSE,
    ];
    static Directions = [
        Direction.E,
        Direction.S,
        Direction.W,
        Direction.N,
        Direction.SE,
        Direction.SW,
        Direction.NW,
        Direction.NE,
    ];
    static OrthogonalDirections = [
        Direction.E,
        Direction.S,
        Direction.W,
        Direction.N,
    ];
    static DiagonalDirections = [
        Direction.SE,
        Direction.SW,
        Direction.NW,
        Direction.NE,
    ];
    static Clockwise = [
        Direction.NE,
        Direction.E,
        Direction.SE,
        Direction.N,
        Direction.None,
        Direction.S,
        Direction.NW,
        Direction.W,
        Direction.SW,
    ];
    static CounterClockwise = [
        Direction.SW,
        Direction.W,
        Direction.NW,
        Direction.S,
        Direction.None,
        Direction.N,
        Direction.SE,
        Direction.E,
        Direction.NE,
    ];
    static Opposite = [
        Direction.SE,
        Direction.S,
        Direction.SW,
        Direction.E,
        Direction.None,
        Direction.W,
        Direction.NE,
        Direction.N,
        Direction.NW,
    ];
    static DirectionToVector = [
        new Vector(-1, -1),
        new Vector(0, -1),
        new Vector(1, -1),
        new Vector(1, 0),
        new Vector(0, 0),
        new Vector(-1, 0),
        new Vector(-1, 1),
        new Vector(0, 1),
        new Vector(1, 1),
    ];
    static Name = [
        'NW',
        'N',
        'NE',
        'W',
        'None',
        'E',
        'SW',
        'S',
        'SE',
    ];
    static VectorToDirection(dx, dy) {
        return (dy + 1) * 3 + (dx + 1);
    }
}
