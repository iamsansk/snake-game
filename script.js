const snakeGround = document.getElementById("snake__ground");
const gameContext = snakeGround.getContext("2d");
const restartBtn = document.querySelector(".restart__btn");
const scoreLabel = document.getElementById("score");
const arrowBtns = document.querySelector(".arrow__btns");
const WIDTH = snakeGround.width;
const HEIGHT = snakeGround.height;
const UNIT = 25;
let foodX,foodY;
let moveX = 25 ,moveY = 0;
let snakeBody = [
    {x:UNIT*2,y:0},
    {x:UNIT,y:0},
    {x:0,y:0}
];
let directions = {
    ArrowRight : [UNIT,0],
    ArrowLeft : [-UNIT,0],
    ArrowUp : [0,-UNIT],
    ArrowDown : [0,UNIT]
};
let currentDirection = "ArrowRight";
let gameOver = true;
let started = false;
let score = 0;
let pause = false;

function startGame(){
    gameContext.fillStyle = "#6A4F4B";
    gameContext.fillRect(0,0,WIDTH,HEIGHT);
    gameContext.font = "30px Nunito";
    gameContext.fillStyle = "#fff";
    gameContext.textAlign = "center";
    gameContext.fillText("Press any key to START!!!",WIDTH/2,HEIGHT/2);
    createFood();
    displayFood();
    drawSnake();
}
startGame();

// generating food in random position
function createFood(){
    do{
        foodX = Math.floor(Math.random()*WIDTH/UNIT)*UNIT;
        foodY = Math.floor(Math.random()*HEIGHT/UNIT)*UNIT;
    }while(snakeBody.some(snakePart=>snakePart.x == foodX && snakePart.y == foodY));
}

// displaying food in the random position
function displayFood(){
    gameContext.fillStyle = "#E52020";
    gameContext.fillRect(foodX,foodY,UNIT,UNIT);
}

// drawing snake
function drawSnake(){
    gameContext.fillStyle = "#FCCD2A";
    gameContext.strokeStyle = "#6A4F4B";
    snakeBody.forEach(snakePart=>{
        gameContext.fillRect(snakePart.x,snakePart.y,UNIT,UNIT);
        gameContext.strokeRect(snakePart.x,snakePart.y,UNIT,UNIT);
    });
}

// moving snake
function moveSnake(){
    let head = {
        x: snakeBody[0].x+moveX,
        y: snakeBody[0].y+moveY
    }
    if(snakeBody.some(snakePart=>snakePart.x === head.x && snakePart.y === head.y)){
        gameOver = true;
        started = false;
        return;
    }
    snakeBody.unshift(head);
    if(snakeBody[0].x === foodX && snakeBody[0].y === foodY){
        createFood();
        scoreLabel.innerText = ++score;
        return;
    }
    snakeBody.pop();
}

// Reset the board 
function clearBoard(){
    gameContext.fillStyle = "#6A4F4B";
    gameContext.fillRect(0,0,WIDTH,HEIGHT);
}

// Keypress events
document.addEventListener("keydown",changeDirection);

function changeDirection(e){
    if(!started){
        gameOver = false;
        started = true;
         // Function for contiuous loop for movement
        nextMove();
    }
    if(e.key === " " && !gameOver){
        console.log("space");
        
        pause = pause?false:true;
        if(!pause){
            nextMove();
        }
    }
    if(directions[e.key]){
        if((e.key == "ArrowRight" && currentDirection == "ArrowLeft") || (e.key == "ArrowLeft" && currentDirection == "ArrowRight") ||(e.key == "ArrowUp" && currentDirection == "ArrowDown") ||(e.key == "ArrowDown" && currentDirection == "ArrowUp")){
            return;
        }
        [moveX,moveY] = directions[e.key];
        currentDirection = e.key;
    }
}

// Arrow button functions
arrowBtns.addEventListener("click",(e)=>{
    if(e.target.tagName === "BUTTON"){
        if(!started){
            gameOver = false;
            started = true;
             // Function for contiuous loop for movement
            nextMove();
        }
        if((e.target.className == "ArrowRight" && currentDirection == "ArrowLeft") || (e.target.className == "ArrowLeft" && currentDirection == "ArrowRight") ||(e.target.className == "ArrowUp" && currentDirection == "ArrowDown") ||(e.target.className == "ArrowDown" && currentDirection == "ArrowUp")){
            return;
        }
        [moveX,moveY] = directions[e.target.className];
        currentDirection = e.target.className;
    }
})

// Continuous execution of code for snake moving thing
function nextMove(){
    if(!gameOver){
        setTimeout(()=>{
            clearBoard();
            displayFood();
            moveSnake();
            checkGameOver();
            drawSnake();
            if(!pause){
                nextMove();
            }
        },200);
    }
    else{
        clearBoard();
        gameContext.font = "30px Nunito";
        gameContext.fillStyle = "#fff";
        gameContext.textAlign = "center";
        gameContext.fillText("GAME OVER!!!",WIDTH/2,HEIGHT/2);
        restartBtn.style.display = "block";
        document.removeEventListener("keydown",changeDirection);
    }
}

// Check Game Over

function checkGameOver(){
    if(snakeBody[0].x<0 || snakeBody[0].x>=WIDTH || snakeBody[0].y<0 || snakeBody[0].y>=HEIGHT){
        gameOver = true;
        started = false;
        return;
    }
}

// Restart button function
restartBtn.addEventListener("click",()=>{
    moveX = 25 ,moveY = 0;
    snakeBody = [
        {x:UNIT*2,y:0},
        {x:UNIT,y:0},
        {x:0,y:0}
    ];
    currentDirection = "ArrowRight";
    score = 0;
    scoreLabel.innerText = score;
    gameOver = true;
    started = false;
    clearBoard();
    startGame();
    restartBtn.style.display = "none";
    document.addEventListener("keydown",changeDirection);
});