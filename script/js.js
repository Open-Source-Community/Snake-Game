const board_border = "black";
const board_background = "#ECDBBA";
const snake_col = "#346751";
//const snake_border = 'darkblue';

let snake = [{ x: 200, y: 200 }];

let changing_direction = false;

let dx = 20;
let dy = 0;

let food_x;
let food_y;

var score = 0;

const button = document.getElementById("buttonReload");

const board = document.getElementById("id");
const snakeboard_ctx = board.getContext("2d");

main();
gen_food();

document.addEventListener("keydown", change_direction);
document.addEventListener("click", handleClick);

//logic

function main() {
  var res = gameOver();
  if (res) return;

  changing_direction = false;
  clearCanvas();
  drawFood();
  move_snake();
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

function random_food(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 20) * 20;
}

function gen_food() {
  food_x = random_food(0, board.width - 50);
  food_y = random_food(0, board.height - 50);
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) gen_food();
  });
}

function move_snake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  snake.unshift(head);

  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;

  if (has_eaten_food) {
    gen_food();
    score += 10;
  } else {
    snake.pop();
  }
}

function gameOver() {
  let over = false;
  if (
    snake[0].x <= 0 ||
    snake[0].y <= 0 ||
    snake[0].x > board.width - 40 ||
    snake[0].y > board.height - 40
  ) {
    over = true;
    showGameover();
  }

  for (var i = 1; i < snake.length - 1; i++) {
    var tmp = snake[i];
    if (tmp.x === snake[0].x && tmp.y === snake[0].y) {
      over = true;
      showGameover();
      break;
    }
  }

  return over;
}

function handleClick(e) {
  const x = e.clientX - board.offsetLeft;
  const y = e.clientY - board.offsetTop;
  if (snakeboard_ctx.isPointInPath(x, y)) {
    button.focus();
    location.reload();
  }
}

function showGameover() {
  snakeboard_ctx.fillStyle = "black";
  snakeboard_ctx.font = "70px hed";
  snakeboard_ctx.fillText("Game Over", 75, 250);
  drawButton(button, board.width / 2 - 75, 300);
}

function drawButton(el, x, y) {
  const active = document.activeElement === el;
  const width = 150;
  const height = 40;

  // Button background
  snakeboard_ctx.fillStyle = "transparent";
  snakeboard_ctx.fillRect(x, y, width, height);

  // Button text
  snakeboard_ctx.font = "40px hed";
  snakeboard_ctx.textAlign = "center";
  snakeboard_ctx.textBaseline = "middle";
  snakeboard_ctx.fillStyle = active ? "blue" : "black";
  snakeboard_ctx.fillText(el.textContent, x + width / 2, y + height / 2);

  // Define clickable area
  snakeboard_ctx.beginPath();
  snakeboard_ctx.rect(x, y, width, height);

  // Draw focus ring, if appropriate
  snakeboard_ctx.drawFocusIfNeeded(el);
}

function change_direction(event) {
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
    dx = -20;
    dy = 0;
  }
  if (keyPressed === upKey && !down) {
    dx = 0;
    dy = -20;
  }
  if (keyPressed === rightKey && !left) {
    dx = 20;
    dy = 0;
  }
  if (keyPressed === downKey && !up) {
    dx = 0;
    dy = 20;
  }
}

function moveU() {
  dx = 0;
  dy = -20;
}

function moveD() {
  dx = 0;
  dy = 20;
}

function moveR() {
  dx = 20;
  dy = 0;
}

function moveL() {
  dx = -20;
  dy = 0;
}

//design

function drawFood() {
  snakeboard_ctx.fillStyle = "#C84B31";
  snakeboard_ctx.strokestyle = "#C84B31";
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
