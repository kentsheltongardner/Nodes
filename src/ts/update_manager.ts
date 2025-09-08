export default class UpdateManager {

    public static readonly UPDATES_PER_SECOND       = 60
    public static readonly UPDATE_MILLISECONDS      = 1 / UpdateManager.UPDATES_PER_SECOND * 1000
    public static readonly MAX_FRAME_MILLISECONDS   = 250

    private time            = 0
    private simulationTime  = 0
    private accumulator     = 0

    public updateCount      = 0
    public interpolation    = 0

    advanceFrame(time: number) {
        // Prevent spiral of death by capping frame time
        let frameTime           = Math.min(time - this.time, UpdateManager.MAX_FRAME_MILLISECONDS)
        this.time               = time
        this.accumulator        = this.accumulator + frameTime
        this.updateCount        = 0
        while (this.accumulator >= UpdateManager.UPDATE_MILLISECONDS) {
            this.accumulator    = this.accumulator - UpdateManager.UPDATE_MILLISECONDS
            this.updateCount    = this.updateCount + 1
            this.simulationTime = this.simulationTime + UpdateManager.UPDATE_MILLISECONDS
        }
        this.interpolation      = this.accumulator / UpdateManager.UPDATE_MILLISECONDS
    }
}