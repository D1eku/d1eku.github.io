class Cell {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.isLive = false;
    }
}
class GameState {
    constructor(grillState, iteration) {
        this.grill = grillState;
        this.iterationLevel = iteration;
    }
}
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
//Pinta cada celda que este viva.
const paintLiveCells = () => {
    for (let i = 0; i < TILES_X; i++) {
        for (let j = 0; j < TILES_Y; j++) {
            if (!testGame.cellIsAlive(i, j)) {
                continue;
            }
            ctx.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
};
//Dibuja los bordes de la grilla
const drawBorders = () => {
    for (let i = 0; i < TILES_X; i++) {
        ctx.beginPath();
        ctx.moveTo(i * TILE_SIZE - 0.5, 0);
        ctx.lineTo(i * TILE_SIZE - 0.5, height);
        ctx.stroke();
    }
    for (let j = 0; j < TILES_Y; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * TILE_SIZE - 0.5);
        ctx.lineTo(width, j * TILE_SIZE - 0.5);
        ctx.stroke();
    }
};
//Limpia todo el tablero.
const clear = () => {
    ctx.clearRect(0, 0, width, height);
};
//LLAMA A las funciones de arriba.
const drawAll = () => {
    clear();
    paintLiveCells();
    drawBorders();
};
const autoGame = () => {
    if (!isGamePaused) {
        drawAll();
        testGame.nextIteration(); //Calcula la siguiente generacion
        setTimeout(autoGame, 100); //Repite el proceso a una velocidad de speed
    }
};
//Obten el canvas.
let canvas = document.getElementById("game");
//Obten el tamaño del canvas
const width = canvas.width;
const height = canvas.height;
const TILE_SIZE = 20; //Tamaño de un cuadro.
const TILES_X = width / TILE_SIZE; //40
const TILES_Y = height / TILE_SIZE; //30
console.log("X, Y = ", TILES_X, TILES_Y);
//Obten el contexto del canvas XD
const ctx = canvas.getContext("2d");
//Define los colores y el tamaño de pincel.
ctx.fillStyle = "rgb(100, 240, 150)";
ctx.strokeStyle = "rgb(90, 90, 90)";
ctx.lineWidth = 1;
//Front end Vars ? 
let isClickPressed = false;
let isGamePaused = true;
let staticSpeed = 100;
//document.getElementById('speedInput').value = 100;
let speed = staticSpeed;
console.log("Velocidad Inicio: ", speed);
//Crea un nuevo juego.
let testGame = new Game(40, 30);
drawBorders(); //Pinta los bordes.
paintLiveCells(); //Pinta las celdas vivas.
//Buttons Events
//Pausa / Play Button
document.getElementById('stopbutton').addEventListener('click', e => {
    let but = document.getElementById('stopbutton');
    if (isGamePaused) { //Si el juego ta pausao
        //Inicialo.
        but.innerHTML = '<i class="fas fa-pause"></i>';
        isGamePaused = false;
        autoGame();
    }
    else { //Si el juego ta corriendo
        //Pausalo.
        but.innerHTML = '<i class="fas fa-play"></i>';
        isGamePaused = true;
    }
});
//Next Step Button
document.getElementById('nextStepButton').addEventListener('click', e => {
    testGame.nextIteration();
    drawAll();
});
//Prev Step Button
document.getElementById('prevStepButton').addEventListener('click', e => {
    testGame.prevIteration();
    drawAll();
});
//Restart Game Button
document.getElementById('restartGame').addEventListener('click', e => {
    let but = document.getElementById('stopbutton');
    but.innerHTML = '<i class="fas fa-play"></i>';
    isGamePaused = true;
    testGame = new Game(40, 30);
    drawAll();
});
//Random Game Button
document.getElementById('randomGame').addEventListener('click', e => {
    testGame.generateRandom();
    drawAll();
});
//Canvas Mouse Events.
canvas.addEventListener("click", e => {
    isClickPressed = !isClickPressed; //Informa que se hizo click
    //Calcula la posicion del mouse
    const x = Math.floor((e.clientX - canvas.offsetLeft) / TILE_SIZE);
    const y = Math.floor((e.clientY - canvas.offsetTop) / TILE_SIZE);
    testGame.changeStateOfCell(x, y);
    drawAll();
});
/*






const clear = () => {//Limpia todo el tabler.
    ctx.clearRect(0,0,width,height)
}

const drawAll = () => {//Dibuja todo entonces.
    clear()//Limpia todo el tablero
    drawBoard()//Dibuja el tablero
    drawBorders()//Dibuja los bordes.
}

const nextGen = () => {//Para la siguiente generacion.
    drawBoard()//Dibuja la tabla
    drawBorders()//Dibuja los bordes.
    if(!isGamePaused){//Si el juego no esta pausado.
        BOARD = computeNextGeneration()//Actualiza el estado de la tabla.
        drawAll()//Dibuja todo nuevamente.
    }
}

const nextGenLoop = () => {//Mantiene el loop todo el juego
    nextGen()//Calcula la siguiente generacion
    setTimeout(nextGenLoop, speed);//Repite el proceso a una velocidad de speed
}

let BOARD = prepareBoard()

BOARD[1][0] = true;
BOARD[2][1] = true;
BOARD[0][2] = true;
BOARD[1][2] = true;
BOARD[2][2] = true;

nextGenLoop();


canvas.addEventListener("mousedown", e => {
    isClickPressed = !isClickPressed;
    console.log(isClickPressed)
    const x = Math.floor((e.clientX - canvas.offsetLeft) /TILE_SIZE)
    const y = Math.floor((e.clientY - canvas.offsetTop) /TILE_SIZE)
    BOARD[x][y] = !BOARD[x][y]
    drawAll()
    console.log(x, y)
})

canvas.addEventListener("mouseup", e => {
    isClickPressed = !isClickPressed;
})

canvas.addEventListener('mousemove', e => {
    if(isClickPressed){
        const x = Math.floor((e.clientX - canvas.offsetLeft) /TILE_SIZE)
        const y = Math.floor((e.clientY - canvas.offsetTop) /TILE_SIZE)
        BOARD[x][y] = !BOARD[x][y]
        drawAll()
        console.log(x, y)
    }
})

//Buttons Events
document.getElementById('stopbutton').addEventListener('click', e => {
    let but = document.getElementById('stopbutton');
    if(isGamePaused){//Si el juego ta pausao
        but.innerHTML = '<i class="fas fa-pause"></i>'
        isGamePaused = !isGamePaused;
    }else{//Si el juego ta corriendo
        but.innerHTML = '<i class="fas fa-play"></i>'
        isGamePaused = !isGamePaused;
    }
})

document.getElementById('buttonSetSpeed').addEventListener('click', e => {
    speed = 1/parseInt(document.getElementById('speedInput').value)
})

document.getElementById('moreSpeedButton').addEventListener('click', e => {
    document.getElementById('speedInput').value = parseInt(document.getElementById('speedInput').value) + 5;
    speed = document.getElementById('speedInput').value;
    console.log("Speed +5 - Speed : ",speed);
})

document.getElementById('lessSpeedButton').addEventListener('click', e => {
    document.getElementById('speedInput').value = parseInt(document.getElementById('speedInput').value) - 5;
    speed = document.getElementById('speedInput').value;
    console.log("Speed -5 - Speed : ",speed);
})

document.getElementById('restartGame').addEventListener('click', e => {
    for(let i=0;i<TILES_X;i++) {
        for(let j=0;j<TILES_Y;j++) {
            BOARD[i][j] = false;
        }
    }
})

document.getElementById('readCSV').addEventListener('click', e=> {
    console.log(document.getElementById('inputGroupFile01'))
    console.log("VALUE \N",document.getElementById('inputGroupFile01').value)
})


*/ 
