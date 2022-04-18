"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
class Cell {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.isLive = false;
    }
}
exports.Cell = Cell;
