export default class UpdateManager {
    static UPDATES_PER_SECOND = 60;
    static UPDATE_MILLISECONDS = 1 / UpdateManager.UPDATES_PER_SECOND * 1000;
    static MAX_FRAME_MILLISECONDS = 250;
    time = 0;
    simulationTime = 0;
    accumulator = 0;
    updateCount = 0;
    interpolation = 0;
    advanceFrame(time) {
        // Prevent spiral of death by capping frame time
        let frameTime = Math.min(time - this.time, UpdateManager.MAX_FRAME_MILLISECONDS);
        this.time = time;
        this.accumulator = this.accumulator + frameTime;
        this.updateCount = 0;
        while (this.accumulator >= UpdateManager.UPDATE_MILLISECONDS) {
            this.accumulator = this.accumulator - UpdateManager.UPDATE_MILLISECONDS;
            this.updateCount = this.updateCount + 1;
            this.simulationTime = this.simulationTime + UpdateManager.UPDATE_MILLISECONDS;
        }
        this.interpolation = this.accumulator / UpdateManager.UPDATE_MILLISECONDS;
    }
}
