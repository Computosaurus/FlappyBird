//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX= -2; //left velocity
let velocityY= 0;
let gravity = 0.4;

let score = 0;
let gameOver = false;
let gameStarted = false;
let firstGame =true;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

//     //Draw flappy bird
// context.fillStyle = "green";
// context.fillRect(bird.x, bird.y, bird.width, bird.height);
    
//load images
birdImg = new Image();
birdImg.src = "./flappybird.png";
birdImg.onload = function(){
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    context.fillStyle = "white";
    context.font = "15px sans-serif";
    context.fillText("Press j or space or arrow up", board.width/2.8, board.height/2);

}

topPipeImg = new Image();
topPipeImg.src = "./toppipe.png";

bottomPipeImg = new Image();
bottomPipeImg.src = "./bottompipe.png";

requestAnimationFrame(update);

setInterval(placePipes, 2500);

document.addEventListener("keydown", moveBird);
}

function update()
{
    
    requestAnimationFrame(update);

    if(gameOver)
    {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    
    if(!gameStarted){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird. height);
        if(firstGame)
            context.fillText("Press j or space or arrow up", board.width/4, board.height/2);
    }
    else{
    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y+velocityY, 0);
    
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird. height);
     
    if(bird.y > board.height)
    {
        gameOver = true;
    }

    //pipes
    for(let i=0; i<pipeArray.length; i++)
    {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x+pipe.width)
        {
            score += 0.5;
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe))
        {
            gameOver = true;
        }
    }


    while (pipeArray.length > 0 && pipeArray[0].x + pipeArray[0].width  < 0)
    {
        pipeArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5,45);

    if(gameOver)
    {
        context.fillText("Game Over", board.width/5.5, board.height/2);
        context.font = "15px sans-serif";
        context.fillText("Press J to restart", board.width/2.8, board.height/2+ 30);
        firstGame = false;
    }
}
}

function placePipes()
{
    if(gameOver)
        {
            return;
        }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let opening = board.height/4;
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY +  pipeHeight + opening,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }

    pipeArray.push(bottomPipe);
}



function moveBird(e)
{
    if(e.code == "Space"|| e.code =="ArrowUp"||e.key == "j")
    {
        gameStarted = true;
        velocityY=-6;

        if(gameOver)
        {
            bird.y=birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
            gameStarted = false;
        }
    }
}

function detectCollision(a,b)
{
    return a.x<b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height> b.y;
}