let tileSize = 32;
let rows = 16;
let columns = 16;

let board = 0;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context = 0;

let shipY = tileSize * rows - tileSize * 2;
let shipX = tileSize * (columns / 2) - tileSize;
let shipWidth = tileSize * 2;
let shipHeight = tileSize;

let ship = {
  x: shipX,
  y: shipY,
  width: shipWidth,
  height: shipHeight,
};

let shipImg;
let shipVelocityX = tileSize;

//aliens
let alienArray = [];
let alienSize = tileSize;
let alienHeight = tileSize;
let alienWidth = tileSize * 2;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienCols = 3;
let alienCount = 0;

let alienVelocityX = 1;

//bullets
let bulletArray = [];
let bulletVelocityY = -10;

//game
let gameOver = false;

//score
let score = 0;

window.onload = () => {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  // draw initial ship
  shipImg = new Image();
  shipImg.src = "assets/ship.png";
  shipImg.onload = () => {
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  };

  alienImg = new Image();
  alienImg.src = "assets/alien.png";
  createAliens();

  requestAnimationFrame(update);
  document.addEventListener("keydown", moveShip);
  document.addEventListener("keyup", shoot);
};

function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, boardWidth, boardHeight);

  context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

  //render aliens
  for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray[i];
    if (alien.alive) {
      alien.x += alienVelocityX;

      if (alien.x + alien.width >= boardWidth || alien.x <= 0) {
        alienVelocityX *= -1;
        alien.x += alienVelocityX * 2;
        for (let j = 0; j < alienArray.length; j++) {
          alienArray[j].y += alienHeight;
        }
      }
      context.drawImage(alien.Img, alien.x, alien.y, alien.width, alien.height);
      if (alien.y >= ship.y) {
        gameOver = true;
        context.fillStyle = "red";
        context.font = "30px Arial";
        context.fillText("Game Over", boardWidth / 2 - 70, boardHeight / 2);
      }
    }
  }

  // render bullets
  for (let i = 0; i < bulletArray.length; i++) {
    let bullet = bulletArray[i];
    bullet.y += bulletVelocityY;
    context.fillStyle = "white";
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    for (let j = 0; j < alienArray.length; j++) {
      let alien = alienArray[j];
      if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
        bullet.used = true;
        alien.alive = false;
        alienCount--;
        score += 10;
      }
    }
  }

  while (
    bulletArray.length > 0 &&
    (bulletArray[0].used || bulletArray[0].y < 0)
  ) {
    bulletArray.shift();
  }

  if (alienCount == 0) {
    alienCols = Math.min(alienCols + 1, columns / 2 - 2);
    alienRows = Math.min(alienRows + 1, rows - 2);
    alienVelocityX += 0.3;
    alienArray = [];
    bulletArray = [];
    createAliens();
  }

  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText("Aliens left: " + alienCount, 5, 40);
  context.fillText(score, 5, 20);
}

function moveShip(e) {
  if (gameOver) {
    return;
  }
  if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
    ship.x -= shipVelocityX;
  } else if (
    e.code == "ArrowRight" &&
    ship.x + shipVelocityX <= boardWidth - ship.width
  ) {
    ship.x += shipVelocityX;
  }
}

function createAliens() {
  for (let c = 0; c < alienCols; c++) {
    for (let r = 0; r < alienRows; r++) {
      let alien = {
        x: alienX + c * alienWidth,
        y: alienY + r * alienHeight,
        Img: alienImg,
        width: alienWidth,
        height: alienHeight,
        alive: true,
      };
      alienArray.push(alien);
    }
  }
  alienCount = alienArray.length;
}

function shoot(e) {
  if (gameOver) {
    return;
  }
  if (e.code == "Space") {
    let bullet = {
      x: ship.x + (shipWidth * 15) / 32,
      y: ship.y,
      width: ship.width / 8,
      height: ship.height / 2,
      used: false,
    };
    bulletArray.push(bullet);
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
