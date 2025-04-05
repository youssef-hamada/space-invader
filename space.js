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
};

function update() {
  requestAnimationFrame(update);

  context.clearRect(0, 0, boardWidth, boardHeight);

  context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

  for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray[i];
    if (alien.alive) {
      alien.x += alienVelocityX;
      if (alien.x + alien.width >= boardWidth || alien.x <= 0) {
        alienVelocityX *= -1;
        for (let j = 0; j < alienArray.length; j++) {
          alienArray[j].y += alienHeight;
        }
      }
      context.drawImage(alien.Img, alien.x, alien.y, alien.width, alien.height);
    }
  }
}

function moveShip(e) {
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
