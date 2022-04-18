"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.GameState = exports.Cell = void 0;
//import { Cell }  from '../scripts/Cell';
//import { GameState } from './GameState';
class Cell {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.isLive = false;
    }
}
exports.Cell = Cell;
class GameState {
    constructor(grillState, iteration) {
        this.grill = grillState;
        this.iterationLevel = iteration;
    }
}
exports.GameState = GameState;
class Game {
    constructor(sizeX, sizeY) {
        //Save state of before iterations.
        this.gameStates = Array(99999);
        this.cantStates = 0;
        this.newIteration = () => {
            //Guarda el anterior estado.
            this.gameStates[this.cantStates] = new GameState(this.grill, this.iterationLevel);
            this.cantStates += 1;
            //Empieza los calculos del siguiente estado
            //this.iterationLevel += 1;//Aumenta en 1 la iteracion.
            const newBoard = this.createNewGrill();
            for (let i = 0; i < this.sizeX; i++) {
                for (let j = 0; j < this.sizeY; j++) {
                    //Para cada celda
                    //Revisa si esta viva la celda.
                    if (!this.cellIsAliveNumber(i, j)) { //Si no esta viva
                        if (this.neighboursCount(i, j) === 3) { //Cuenta si tiene 3 vecinos
                            newBoard[i][j].isLive = true; //Entonces esa posicion vive 
                        }
                    }
                    else { //Si esta viva.
                        const count = this.neighboursCount(i, j); //Cuenta los vecinos
                        if (count == 2 || count == 3) { //Si tiene 2 o 3 vecinos
                            newBoard[i][j].isLive = true; //La celda igual vive.
                        }
                    }
                }
            }
            this.grill = newBoard; //Asina el nuevo estado.
        };
        this.viewStateGame = () => {
            for (let i = 0; i < this.sizeX; i++) {
                for (let j = 0; j < this.sizeY; j++) {
                    console.log(this.grill[i][j].isLive);
                }
            }
        };
        //Cuenta los vecinos (vivos) al rededor de una posicion de celda.
        this.neighboursCount = (x, y) => {
            let count = 0; //Empieza a contar de 0
            for (let i of [-1, 0, 1]) { // i puede tomar 3 valores -1, 0, 1
                for (let j of [-1, 0, 1]) { // j puede tomar 3 valores -1, 0, 1
                    if (!(i === 0 && j === 0)) {
                        count += this.cellIsAliveNumber(x + i, y + j); //Suma 1 si la celda vecina esta viva o 0 si no esta viva.
                    }
                }
            }
            return count; //Retorna la cantidad de celdas vivas.
        };
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.iterationLevel = 1;
        this.grill = [];
        for (let i = 0; i < sizeX; i++) {
            this.grill[i] = [];
            for (let j = 0; j < sizeY; j++) {
                this.grill[i][j] = new Cell(i, j);
            }
        }
        this.gameStates[this.cantStates] = new GameState(this.grill, this.iterationLevel); //Guarda el primer estado.
        this.cantStates += 1;
        console.log(this.grill);
    }
    nextIteration() {
        this.iterationLevel += 1;
        if (this.iterationLevel > this.cantStates) {
            //Si el siguiente paso es una iteracion mayor a la cantidad de estados.
            //Realizamos una nueva iteracion.
            this.newIteration();
        }
        else { //Si es menor quiere decir que estamos atras en las iteraciones de la cantidad de estados que hemos tenido o la cantidad de iteraciones totales realizadas.
            this.grill = this.gameStates[this.iterationLevel].grill;
        }
    }
    prevIteration() {
        this.iterationLevel -= 1;
        if (this.iterationLevel >= 0 && this.iterationLevel < this.cantStates) {
            this.grill = this.gameStates[this.iterationLevel].grill;
        }
        else {
            this.iterationLevel += 1;
        }
    }
    cellIsAlive(x, y) {
        return this.grill[x][y].isLive;
    }
    //Revisa si la celda de la posicion dada, esta viva o no. 
    //Retornara 1 si esta viva la celda.
    //Retornara 0 si la pos esta fuera de rango o si la celda esta muerta.
    cellIsAliveNumber(x, y) {
        return (x < 0 || x >= this.sizeX || y < 0 || y >= this.sizeY) ? 0 : this.grill[x][y].isLive ? 1 : 0;
    }
    createNewGrill() {
        const auxGrill = [];
        for (let i = 0; i < this.sizeX; i++) {
            auxGrill[i] = [];
            for (let j = 0; j < this.sizeY; j++) {
                auxGrill[i][j] = new Cell(i, j);
            }
        }
        return auxGrill;
    }
    changeStateOfCell(x, y) {
        this.grill[x][y].isLive = !this.grill[x][y].isLive;
    }
    generateRandom() {
        const auxGrill = this.createNewGrill();
        for (let i = 0; i < this.sizeX; i++) {
            for (let j = 0; j < this.sizeY; j++) {
                auxGrill[i][j].isLive = Math.random() > 0.9;
            }
        }
        this.grill = auxGrill;
    }
}
exports.Game = Game;
