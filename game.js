/**
 * @type {HTMLCanvasElement}
 */

const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');
const contenedorBotonoes = document.querySelector('#contenedor-botones');

let canvasSize;
let elementSize;
let timeStart;
let timePlayer;
let btnReiniciar;
let recordPlayer = 0;
let timeInterval;
let level = 0;
let lives = 3;

const playerPosition = {
    x: undefined,
    y: undefined,
};
const giftPosition = {
    x: undefined,
    y: undefined,
};

let listaPosicionBombas = [];

window.addEventListener('load',setCanvas);
window.addEventListener('resize',setCanvas);

function setCanvas(){
    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth*0.7;
    }else{
        canvasSize = window.innerHeight*0.7;
    }

    canvas.setAttribute('width',canvasSize);
    canvas.setAttribute('height',canvasSize);

    elementSize = (canvasSize / 10)-1;
    elementSize = Number(elementSize.toFixed(0));

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    timeStart = undefined;

    startGame();
}

function startGame(){
    game.font = elementSize +'px Verdana';
    game.textAlign = 'end';
    const map = maps[level];
    if(!map){
        gameWin();
        level = 0;
        return;
    }

    if(!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime,100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map((row)=> row.trim().split(''));

    livesCount();
    listaPosicionBombas = [];
    game.clearRect(0,0,canvasSize,canvasSize);
    mapRowCols.forEach((row,rowI)=>{
        row.forEach((col,colI)=>{
            const posX = elementSize * (colI + 1);
            const posY = elementSize * (rowI + 1);
            if(playerPosition.x == undefined && playerPosition.y == undefined && col == 'O'){
                playerPosition.x = posX;
                playerPosition.y = posY;
            }else if(col == 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
            }else if(col == 'X'){
                listaPosicionBombas.push({
                    x: posX,
                    y: posY,
                });
            }
            game.fillText(emojis[col],posX,posY);
        })
    });

    moverPlayer();
    
    /* for(let row = 1; row <= 10; row++){
        for(let col = 1; col <= 10; col++){
            game.fillText(emojis[mapRowCols[row-1][col-1]],elementSize*col, elementSize*row);
        }
    } */

    //game.fillRect(0,50,100,100);
    //game.clearRect(0,50,50,50);
   /*  game.font = '25px Verdana';
    game.fillStyle = 'purple';
    game.textAlign = 'center';
    game.fillText('platzi',100,100); */

}
function moverPlayer(){
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollisionXY= giftCollisionX && giftCollisionY;
    const bombaCollisionXY = listaPosicionBombas.find(bomba => {
       const bombaCollisionX = bomba.x.toFixed(3) == playerPosition.x.toFixed(3);
       const bombaCollisionY = bomba.y.toFixed(3) == playerPosition.y.toFixed(3);
       return bombaCollisionX && bombaCollisionY;
    });
  
    if(giftCollisionXY){
        levelUp();
    }else if(bombaCollisionXY){
        console.log('Tocaste una bomba');
        game.fillText(emojis['EXPLOTION'],playerPosition.x,playerPosition.y);
       setTimeout(gameFailed,1000);
    }else{
        game.fillText(emojis['PLAYER'],playerPosition.x,playerPosition.y);
    }
}

function levelUp(){
    console.log('Subiste de nivel');
    level++;
    startGame();
}

function gameWin(){
    console.log('Ganaste!');
    clearInterval(timeInterval);

   const timeRecord = localStorage.getItem('record');

   if(timeRecord){
    if(timeRecord > timePlayer){
        localStorage.setItem('record',timePlayer);
        pResult.innerHTML = 'SUPERASTE EL RECORD! 🎉';
    }else{
        pResult.innerHTML = 'NO SUPERASTE EL RECORD 🥺';
    }
   }else{
    localStorage.setItem('record',timePlayer);
    pResult.innerHTML = '¿Primera vez?, intenta de nuevo y supera tu record';
   }

   reiniciarJuego();
}

function gameFailed(){
    console.log('Regresaste a la posicion inicial');
    lives--;
    console.log(lives);
    if(lives <= 0){
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function livesCount(){
    const heartsArray = Array(lives).fill(emojis['HEART']);
    console.log(heartsArray);
    spanLives.innerHTML ="";
    heartsArray.forEach(heart =>{
        spanLives.append(heart);
    })

    // spanLives.innerHTML = emojis["HEART"].repeat(lives)
}

function showTime(){
    timePlayer = (Date.now() - timeStart);
   spanTime.innerHTML = timePlayer;
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record');
}

function reiniciarJuego(){
    btnReiniciar =  `
    <button id="reinicio-juego" class="btns">Reiniciar</button>
    `
    contenedorBotonoes.innerHTML = btnReiniciar;
    const buttonReinicio = document.querySelector('#reinicio-juego');
    buttonReinicio.addEventListener('click',()=> location.reload());
}

window.addEventListener('keydown',sePresionoUnaTecla);
btnUp.addEventListener('click',moverArriba);
btnDown.addEventListener('click',moverAbajo);
btnLeft.addEventListener('click',moverIzquierda);
btnRight.addEventListener('click',moverDerecha);

function moverArriba(){
    console.log('mover arriba');
    if((playerPosition.y - elementSize) < elementSize){
        console.log('OUT moverArriba')
    }else{
        playerPosition.y -= elementSize;
    startGame();
    }
    
}

function moverAbajo(){
    console.log('mover abajo');
    if((playerPosition.y + elementSize) > canvasSize){
        console.log('OUT moverAbajo')
    }else{
        playerPosition.y += elementSize;
    startGame();
    }
}

function moverIzquierda(){
    console.log('mover izquierda');
    if((playerPosition.x - elementSize) < elementSize){
        console.log('OUT moverIzquierda')
    }else{
        playerPosition.x -= elementSize;
    startGame();
    }
}

function moverDerecha(){
    console.log('mover derecha');
    if((playerPosition.x + elementSize) > canvasSize){
        console.log('OUT moverArriba')
    }else{
        playerPosition.x += elementSize;
    startGame();
    }
}

    function sePresionoUnaTecla(event){
        switch(event.key){
            case 'ArrowUp':
                moverArriba()
                break
            case 'ArrowDown':
                moverAbajo()
                break
            case 'ArrowLeft':
                moverIzquierda()
                break
            case 'ArrowRight':
                moverDerecha()
                break
            default:
                break;
        }
    }