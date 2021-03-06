const board_border = 'black';
const board_background = "#ECDBBA";
const snake_col = '#346751';
//const snake_border = 'darkblue';

let snake = [
     { x: 200, y: 200 },
];


let changing_direction = false;


let dx = 20;
let dy = 0;

let food_x;
let food_y;

var score = 0;

const buttons = {};
const board = document.getElementById("id");
const snakeboard_ctx = board.getContext("2d");
const retryButton = document.getElementById('retryButton');

load()

document.addEventListener("keydown", changeDirection);
window.addEventListener('beforeunload', setHighScore); // set highscore if tab is closed/game ends

for (const element of document.querySelectorAll('button')) {
     buttons[element.classList[0]] = element
}

//logic
function load() {
     snake = [
          { x: 200, y: 200 },
     ];


     changing_direction = false;


     dx = 20;
     dy = 0;

     food_x;
     food_y;

     score = 0;
     main();
     genFood();
     setHighScore();
     retryButton.style.display = 'none';

}
function main() {
     var res = gameOver();
     if (res)
          return;


     changing_direction = false;
     clearCanvas();
     drawFood();
     moveSnake();
     drawSnake();
     drawScore();

     setTimeout(main, 100);
}

function clearCanvas() {

     snakeboard_ctx.fillStyle = board_background;

     snakeboard_ctx.strokestyle = board_border;

     snakeboard_ctx.fillRect(0, 0, board.width, board.height);

     snakeboard_ctx.strokeRect(0, 0, board.width, board.height);
}


function randomFood(min, max) {
     return Math.round((Math.random() * (max - min) + min) / 20) * 20;
}

function genFood() {
     food_x = randomFood(0, board.width - 50);
     food_y = randomFood(0, board.height - 50);
     snake.forEach((part) => {
          const has_eaten = part.x == food_x && part.y == food_y;
          if (has_eaten) genFood();
     });
}

function moveSnake() {
     const head = { x: snake[0].x + dx, y: snake[0].y + dy };

     snake.unshift(head);

     const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;

     if (has_eaten_food) {
          genFood();
          score += 10;
     }
     else {
          snake.pop();
     }

}

function gameOver() {
     let over = false;
     if (snake[0].x <= 0 || snake[0].y <= 0 || snake[0].x > board.width - 40 || snake[0].y > board.height - 40) {
          over = true;
     }

     for (var i = 1; i < snake.length - 1; i++) {
          var tmp = snake[i];
          if (tmp.x === snake[0].x && tmp.y === snake[0].y) {
               over = true;
               break;
          }
     }
     if (over) {
          snakeboard_ctx.fillStyle = "black";
          snakeboard_ctx.font = "70px hed";
          snakeboard_ctx.fillText("Game Over", 75, 250);
          setHighScore(score); // Update the high score to new high score if achieved.
          retryButton.style.display = 'block';
     }
     return over;
}

function changeDirection(event) {
     const leftKey = 37;
     const rightKey = 39;
     const upKey = 38;
     const downKey = 40;

     if (changing_direction) return;

     changing_direction = true;
     const keyPressed = event.keyCode;
     const up = dy === -20;
     const down = dy === 20;
     const right = dx === 20;
     const left = dx === -20;

     if (keyPressed === leftKey && !right) {
          moveL()
     }
     if (keyPressed === upKey && !down) {
          moveU()
     }
     if (keyPressed === rightKey && !left) {
          moveR()
     }
     if (keyPressed === downKey && !up) {
          moveD()
     }
}


function moveU() {
     setActive('up');
     dx = 0;
     dy = -20;
}

function moveD() {
     setActive('down');
     dx = 0;
     dy = 20;
}

function moveR() {
     setActive('right');
     dx = 20;
     dy = 0;
}

function moveL() {
     setActive('left');
     dx = -20;
     dy = 0;
}

//design

function drawFood() {

     snakeboard_ctx.fillStyle = '#C84B31';
     snakeboard_ctx.strokestyle = '#C84B31';
     snakeboard_ctx.fillRect(food_x, food_y, 20, 20);
     snakeboard_ctx.strokeRect(food_x, food_y, 20, 20);
}

function drawSnakePart(snakePart) {
     // snakeboard_ctx .roundRect(snakePart.x, snakePart.y, 200, 200, 20);

     snakeboard_ctx.fillStyle = snake_col;

     //snakeboard_ctx.strokestyle = snake_border;

     snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 20, 20);

     //snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
}

function drawSnake() {
     snake.forEach(drawSnakePart);
}

function drawScore() {
     snakeboard_ctx.fillStyle = "black";
     snakeboard_ctx.font = "20px hed";
     snakeboard_ctx.fillText("Score: " + score, 10, 20);
}

function setActive(btn) {
     for (const [button, element] of Object.entries(buttons)) {
          if (btn == button) element.classList.add('active')
          else element.classList.remove('active')
     }
}

function setHighScore() {
     let fetchedScore = Number(localStorage.getItem("highScore")) || 0;
     let highscore = document.getElementById("high-score");
     fetchedScore = Math.max(fetchedScore, score) || 0;
     highscore.textContent = fetchedScore;
     localStorage.setItem("highScore", fetchedScore);
}
