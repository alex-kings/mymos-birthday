/**
 * Class containing the state of the game and functions to update it.
 */
class Game{

    constructor(){
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.tileNb = 15;
        this.tileSize = this.canvas.width/this.tileNb;
        this.gameSpeed = 5;
        this.bgColour = "#f7ff61";
        this.headImg = new Image(0,0);
        this.bodyImg = new Image();
        this.headImg.src = "./Images/jolyney-head.png";
        this.bodyImg.src = "./Images/snake_body.png";

        this.snake = new Snake(5,5);
        this.fruit = new Fruit(2,2);
        this.gameEnd = false;
    }

    // Function called at each game tick
    gameTick(){
        this.empty();
        this.moveSnake();
        this.fruitCollision();
        this.drawSnake();
        this.drawFruit();
        if(this.snake.bodyCollision()) {
            this.gameEnd = true;
            console.log("ENNNND")
        }
    }

    empty(){
        this.ctx.fillStyle = this.bgColour;
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the snake at the correct location.
     */
    drawSnake(){
        this.drawBody();
        this.drawHead();
    }

    moveSnake(){
        this.snake.prevHeadX = this.snake.headX;
        this.snake.prevHeadY = this.snake.headY;
        this.snake.headX += this.snake.xDir;
        this.snake.headY += this.snake.yDir;
        if(this.snake.headX < 0) this.snake.headX = this.tileNb-1;
        if(this.snake.headY < 0) this.snake.headY = this.tileNb-1;
        if(this.snake.headX === this.tileNb) this.snake.headX = 0;
        if(this.snake.headY === this.tileNb) this.snake.headY = 0;
        this.snake.moveBody();
    }
    
    /**
     * Draws the head of the snake.
     */
    drawHead(){
        this.ctx.save();
        this.ctx.translate((this.snake.headX+0.5)*this.tileSize,(this.snake.headY+0.5)*this.tileSize);
        this.ctx.rotate(this.snake.headDeg*Math.PI/180);
        this.ctx.drawImage(this.headImg, -0.5*this.tileSize,-0.5*this.tileSize,this.tileSize,this.tileSize);
        this.ctx.restore();
    }
    
    /**
     * Draws the body of the snake.
     */
    drawBody(){
        this.snake.bodyParts.forEach(bodyPart => {
            this.ctx.fillStyle = bodyPart.colour;
            this.ctx.drawImage(this.bodyImg, bodyPart.x * this.tileSize,bodyPart.y * this.tileSize,this.tileSize,this.tileSize);
        })
    }

    /**
     * Places a fruit on a random position on the board.
     */
    placeNewFruit(){
        this.fruit.x = Math.floor(Math.random()*this.tileNb);
        this.fruit.y = Math.floor(Math.random()*this.tileNb);
    }

    /**
     * Draws the fruit on the board.
     */
    drawFruit() {
        this.ctx.fillStyle = this.fruit.colour;
        this.ctx.fillRect(this.fruit.x*this.tileSize, this.fruit.y*this.tileSize, this.tileSize, this.tileSize);
    }

    /**
     * Checks if the snake head collisions with the fruit.
     */
    fruitCollision(){
        if(this.snake.headX === this.fruit.x && this.snake.headY === this.fruit.y){
            //Fruit eaten.
            this.placeNewFruit();
            this.gameSpeed++;
            this.snake.addBodyPart(this.snake.headX, this.snake.headY);
        }
    }

    /**
     * Ends the game.
     */
    end(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
    }
}

/**
 * Class containing the state of the snake on the board and functions to update it.
 */
class Snake{
    headX = 0;
    headY = 0;
    prevHeadX = 0;
    prevHeadY = 0;
    headDeg = 270;
    tailX = 1;
    tailY = 1;
    length = 0; // The length of the body following the head.
    bodyParts = [];
    headDirection = 0;
    xDir = 1;
    yDir = 0;

    constructor(x, y){
        this.headX = x;
        this.headY = y;
    }

    /**
     * Changes the direction of the snake.
     * @param {int} xDir The new x direction.
     * @param {int} xDir The new y direction.
     */
    changeDirection(xDir, yDir){
        if(this.xDir + xDir != 0) this.xDir = xDir; 
        if(this.yDir + yDir != 0) this.yDir = yDir;

        this.headOrientation();
    }

    /**
     * Orients the head.
     */
    headOrientation(){
        if(this.xDir === 1) this.headDeg = 270;
        if(this.xDir === -1) this.headDeg = 90;
        if(this.yDir === 1) this.headDeg = 0;
        if(this.yDir === -1) this.headDeg = 180;
    }

    /**
     * Adds a bodypart at position x-y.
     * @param {int} x The x position of the bodypart
     * @param {int} y The y position of the bodypart
     */
    addBodyPart(x, y){
        this.bodyParts.unshift(new Body(x,y));
    }
    
    /**
     * Moves the body of the snake.
     */
    moveBody(){
        // Moves the body if there is no bodyPart at the head position.
        if(this.bodyParts.length === 0) return null;
        if(this.bodyParts[0].x === this.headX && this.bodyParts[0].y === this.headY){
            return null
        }
        this.bodyParts.pop();
        this.addBodyPart(this.prevHeadX, this.prevHeadY);
    }

    /**
     * Determines whether the head enters in collision with a bodypart.
     */
    bodyCollision(){
        if(this.bodyParts.length < 2) return false;
        for(let i = 1; i < this.bodyParts.length; i++){
            if(this.bodyParts[i].x === this.headX && this.bodyParts[i].y === this.headY) return true
        }
        return false;
    }
}

/**
 * Class for the state of a body part of the snake.
 */
class Body{
    x = 0;
    y = 0;
    colour="green";
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

/**
 * Class for fruits.
 */
class Fruit{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.colour = "red";
    }
}



const game = new Game();

/**
 * Event listeners.
 */
window.addEventListener("keydown",(event)=>{
    switch (event.code) {
        case "ArrowUp":
            game.snake.changeDirection(0,-1);
            break;
        case "ArrowDown":
            game.snake.changeDirection(0,1);
            break;
        case "ArrowLeft":
            game.snake.changeDirection(-1,0);
            break;
        case "ArrowRight":
            game.snake.changeDirection(1,0);
            break;
    
        default:
            break;
    }
})

function gameLoop(){
    if(!game.gameEnd){
        game.gameTick();
        window.setTimeout(gameLoop, 1000/game.gameSpeed);
    }
    else game.end();
}

export function startGame(){
    gameLoop();
}
