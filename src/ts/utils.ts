

export function lerp(a: number, b: number, position: number) {
    return a + (b - a) * position
}