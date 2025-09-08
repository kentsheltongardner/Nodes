import Vector from './vector.js'

export default class Direction {

    public static readonly NW   = 0
    public static readonly N    = 1
    public static readonly NE   = 2

    public static readonly W    = 3
    public static readonly None = 4
    public static readonly E    = 5

    public static readonly SW   = 6
    public static readonly S    = 7
    public static readonly SE   = 8

    public static readonly BitE = 0b00000001
    public static readonly BitS = 0b00000010
    public static readonly BitW = 0b00000100
    public static readonly BitN = 0b00001000

    public static readonly BitSE = 0b00010000
    public static readonly BitSW = 0b00100000
    public static readonly BitNW = 0b01000000
    public static readonly BitNE = 0b10000000

    public static readonly Bits = [
        Direction.BitNW,
        Direction.BitN,
        Direction.BitNE,
        Direction.BitW,
        0,
        Direction.BitE,
        Direction.BitSW,
        Direction.BitS,
        Direction.BitSE,
    ]



    public static Directions = [
        Direction.E,
        Direction.S,
        Direction.W,
        Direction.N,
        Direction.SE,
        Direction.SW,
        Direction.NW,
        Direction.NE,
    ]

    public static OrthogonalDirections = [
        Direction.E,
        Direction.S,
        Direction.W,
        Direction.N,
    ]

    public static DiagonalDirections = [
        Direction.SE,
        Direction.SW,
        Direction.NW,
        Direction.NE,
    ]

    public static readonly Clockwise = [
        Direction.NE,
        Direction.E,
        Direction.SE,

        Direction.N,
        Direction.None,
        Direction.S,

        Direction.NW,
        Direction.W,
        Direction.SW,
    ]

    public static readonly CounterClockwise = [
        Direction.SW,
        Direction.W,
        Direction.NW,

        Direction.S,
        Direction.None,
        Direction.N,

        Direction.SE,
        Direction.E,
        Direction.NE,
    ]

    public static readonly Opposite = [
        Direction.SE,
        Direction.S,
        Direction.SW,

        Direction.E,
        Direction.None,
        Direction.W,

        Direction.NE,
        Direction.N,
        Direction.NW,
    ]

    public static readonly DirectionToVector = [
        new Vector(-1, -1),
        new Vector(0, -1),
        new Vector(1, -1),

        new Vector(1, 0),
        new Vector(0, 0),
        new Vector(-1, 0),

        new Vector(-1, 1),
        new Vector(0, 1),
        new Vector(1, 1),
    ]


    public static readonly Name = [
        'NW',
        'N',
        'NE',

        'W',
        'None',
        'E',

        'SW',
        'S',
        'SE',
    ]

    public static VectorToDirection(dx: number, dy: number) {
        return (dy + 1) * 3 + (dx + 1)
    }
}