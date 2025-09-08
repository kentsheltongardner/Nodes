export default class Mover {
    static Acceleration = 0.1; // Cells per seconds ^2
    position = 0;
    speed = 0;
    moving = false;
    start() {
        this.moving = true;
    }
    speedUp(deltaTime) {
        this.speed += Mover.Acceleration * deltaTime;
    }
    slowDown(deltaTime) {
    }
    move(deltaTime) {
        this.position += this.speed * deltaTime;
    }
    coast() {
    }
    stop() {
        this.moving = false;
        this.position = 0;
        this.speed = 0;
    }
}
