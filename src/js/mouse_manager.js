export default class MouseManager {
    leftDown = false;
    rightDown = false;
    screenX = 0;
    screenY = 0;
    x = 0;
    y = 0;
    leftDownX = 0;
    leftDownY = 0;
    wheelTurn(e) {
    }
    mouseDown(e) {
    }
    mouseMove(e) {
    }
    mouseUp(e) {
    }
    mouseLeave() {
        this.leftDown = false;
        this.rightDown = false;
    }
}
