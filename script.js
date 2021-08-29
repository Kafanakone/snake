window.onload = function(){
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;
    init();

    function init(){
        var canvas = document.createElement('canvas')
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid #055005";
        canvas.style.margin = "auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#8ecc39";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new snake([[0,4], [5,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }
    function refreshCanvas(){
        snakee.advance();
        if(snakee.checkCollision()){
            gameOver();
        }
        else{
                if(snakee.isEatingApple(applee)){
                    score++;
                    snakee.ateApple = true;
                    do{
                        applee.setNewPosition();
                    }
                    while(applee.isOnSnake(snakee));
                }
            

            ctx.clearRect(0,0,canvasWidth, canvasHeight);
            drawScore()
            snakee.draw();
            applee.draw();
            timeout = setTimeout(refreshCanvas,delay);
        }
        
    }
    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.fillText("Appuyer sur la touche espace pour Rejouer", centreX, centreY - 120);
        ctx.restore();
    }
    function restart(){
        snakee = new snake([[0,4], [5,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }
    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString() , centreX, centreY);
        ctx.restore();
    }
    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }
    function snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false; 
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#5076f9";
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function(){
            var nextposition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextposition[0] -= 1;
                    break;
                case "right":
                    nextposition[0] += 1
                    break;
                case "down":
                    nextposition[1] += 1
                    break;
                case "up":
                    nextposition[1] -= 1
                    break
                    default:
                        throw("Direction invalide")
            }
            this.body.unshift(nextposition);
            if(!this.ateApple){
                this.body.pop();
            }
            else{
                this.ateApple = false;
            }
        }
        this.setDirection = function(newDirection){
            var allowedDirection;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirection =["up", "down"]
                    break;
                case "down":
                case "up":
                    allowedDirection =["left", "right"]
                    break
                default:
                    throw("Direction invalide")
            }
            if(allowedDirection.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };
        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticallWalls = snakeY < minY || snakeY > maxY;
            
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticallWalls){
                wallCollision = true;
            }
            for(var i = 0; i < rest.length; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1] ){
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                return true
            }
            else{
                return false
            }
        }
    }
    function Apple (position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#f43706";
            ctx.beginPath();
            var raduis = blockSize/2;
            var x = this.position[0]*blockSize + raduis;
            var y = this.position[1]*blockSize + raduis;
            ctx.arc(x,y, raduis, 0, Math.PI*2, true)
            ctx.fill();
            ctx.restore();
        }
        this.setNewPosition = function(){
            var newX = Math.round(Math.random() * (widthInBlocks -1));
            var newY = Math.round(Math.random() * (heightInBlocks -1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function(snakeTocheck){
            var isOnSnake = false;

                for(var i=0; i < snakeTocheck.body.length; i++){
                    if(this.position[0] === snakeTocheck.body[i][0] && this.position[1] === snakeTocheck.body[i][1]){
                        isOnSnake = true;
                    }

                }
                return isOnSnake;
            
        };
    }
    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37:
                newDirection = "left"
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down"
                break;
            case 32:
                restart();
                return;
            default:
                    return;
        }
        snakee.setDirection(newDirection);
    }
    
    
}