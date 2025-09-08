import Tile from './tile.js';
import Button from './button.js';
import Direction from './direction.js';
import Layer from './layer.js';
import Coin from './coin.js';
export default class Level {
    w;
    h;
    buttonsGrid;
    tilesGrid;
    cardsGrid;
    coinsGrid;
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.tilesGrid = new Array(w);
        this.buttonsGrid = new Array(w);
        this.cardsGrid = new Array(w);
        this.coinsGrid = new Array(w);
        for (let i = 0; i < w; i++) {
            this.tilesGrid[i] = new Array(h);
            this.buttonsGrid[i] = new Array(h);
            this.cardsGrid[i] = new Array(h);
            this.coinsGrid[i] = new Array(h);
            for (let j = 0; j < h; j++) {
                this.tilesGrid[i][j] = new Tile(Tile.None, 0);
                this.buttonsGrid[i][j] = new Button(Button.Unary, 0);
                this.cardsGrid[i][j] = [];
                this.coinsGrid[i][j] = new Coin(Coin.None);
            }
        }
        this.tilesGrid[0][0].type = Tile.Slider;
        this.tilesGrid[1][0].type = Tile.Slider;
        this.tilesGrid[2][0].type = Tile.Slider;
        this.tilesGrid[3][0].type = Tile.Slider;
        this.tilesGrid[4][0].type = Tile.Slider;
        this.tilesGrid[2][1].type = Tile.Wall;
        this.tilesGrid[4][4].type = Tile.Slider;
        this.tilesGrid[4][5].type = Tile.Slider;
        this.tilesGrid[5][4].type = Tile.Slider;
        this.tilesGrid[5][5].type = Tile.Slider;
        this.tilesGrid[6][5].type = Tile.Slider;
        this.tilesGrid[0][0].connections |= Direction.BitE;
        this.tilesGrid[1][0].connections |= Direction.BitW;
        this.tilesGrid[4][5].connections |= Direction.BitN;
        this.tilesGrid[4][4].connections |= Direction.BitS;
        this.tilesGrid[4][4].connections |= Direction.BitE;
        this.tilesGrid[5][4].connections |= Direction.BitW;
        this.tilesGrid[5][4].connections |= Direction.BitS;
        this.tilesGrid[5][5].connections |= Direction.BitN;
        this.tilesGrid[5][5].connections |= Direction.BitE;
        this.tilesGrid[6][5].connections |= Direction.BitW;
    }
    outOfBounds(x, y) {
        return x < 0 || y < 0 || x >= this.w || y >= this.h;
    }
    // Returns true for all moves of length 1
    invalidMovementLength(dx, dy) {
        return dx * dx + dy * dy !== 1;
    }
    isValidSelection(gridX, gridY) {
        if (this.outOfBounds(gridX, gridY))
            return false;
        const block = this.tilesGrid[gridX][gridY];
        const type = block.type;
        if (type !== Tile.Slider)
            return false;
        return true;
    }
    // Recursively counts the number of blocks that would be moved if the block at (x, y) were pushed in the (dx, dy) direction
    // Returns Number.POSITIVE_INFINITY if the move is invalid (blocked by a wall or out of bounds)
    movingCount(x, y, dx, dy) {
        if (this.outOfBounds(x, y))
            return Number.POSITIVE_INFINITY;
        const block = this.tilesGrid[x][y];
        if (block.pushed)
            return 0;
        const type = block.type;
        if (type === Tile.None)
            return 0;
        if (type === Tile.Wall)
            return Number.POSITIVE_INFINITY;
        block.pushed = 1;
        let count = 1;
        count += this.movingCount(x + dx, y + dy, dx, dy);
        if ((block.connections & Direction.BitE) !== 0)
            count += this.movingCount(x + 1, y, dx, dy);
        if ((block.connections & Direction.BitS) !== 0)
            count += this.movingCount(x, y + 1, dx, dy);
        if ((block.connections & Direction.BitW) !== 0)
            count += this.movingCount(x - 1, y, dx, dy);
        if ((block.connections & Direction.BitN) !== 0)
            count += this.movingCount(x, y - 1, dx, dy);
        return count;
    }
    // Clears all pushed flags in the connected component containing (x, y)
    clearMove(x, y, dx, dy) {
        if (this.outOfBounds(x, y))
            return;
        const block = this.tilesGrid[x][y];
        if (!block.pushed)
            return;
        block.pushed = 0;
        this.clearMove(x + dx, y + dy, dx, dy);
        if ((block.connections & Direction.BitE) !== 0)
            this.clearMove(x + 1, y, dx, dy);
        if ((block.connections & Direction.BitS) !== 0)
            this.clearMove(x, y + 1, dx, dy);
        if ((block.connections & Direction.BitW) !== 0)
            this.clearMove(x - 1, y, dx, dy);
        if ((block.connections & Direction.BitN) !== 0)
            this.clearMove(x, y - 1, dx, dy);
    }
    //  Moves all pushed blocks in the given direction, recursively moving connected blocks
    //  Assumes that the move is valid, and that the pushed flags are set correctly
    //  Moves forward-most first, then clockwise, then counterclockwise, then opposite,
    //      to avoid blocks being overwritten
    move(x, y, dx, dy, cwBit, ccwBit, oppBit) {
        if (this.outOfBounds(x, y))
            return;
        const block = this.tilesGrid[x][y];
        if (!block.pushed)
            return;
        block.pushed = 0;
        this.move(x + dx, y + dy, dx, dy, cwBit, ccwBit, oppBit);
        const next = this.tilesGrid[x + dx][y + dy];
        next.type = block.type;
        next.connections = block.connections;
        block.type = Tile.None;
        const connections = block.connections;
        block.connections = 0;
        if ((connections & cwBit) !== 0)
            this.move(x - dy, y + dx, dx, dy, cwBit, ccwBit, oppBit);
        if ((connections & ccwBit) !== 0)
            this.move(x + dy, y - dx, dx, dy, cwBit, ccwBit, oppBit);
        if ((connections & oppBit) !== 0)
            this.move(x - dx, y - dy, dx, dy, cwBit, ccwBit, oppBit);
    }
    //  Returns the topmost non-empty layer at the given grid position
    activeLayer(gridX, gridY) {
        if (this.outOfBounds(gridX, gridY))
            return Layer.None;
        if (this.coinsGrid[gridX][gridY].type !== Coin.None)
            return Layer.Coin;
        if (this.tilesGrid[gridX][gridY].type !== Tile.None)
            return Layer.Tile;
        if (this.cardsGrid[gridX][gridY].length !== 0)
            return Layer.Card;
        return Layer.Button;
    }
}
