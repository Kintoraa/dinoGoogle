const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");
const groundWidth = canvas.clientWidth;
const groundHeight = 10;
const groundX = 0;
const groundY = canvas.clientHeight - 10;
const dinoX = 50;
const dinoSize = 100;
const obsSize = 30;
const obsY = groundY - obsSize;
const dinoImg = new Image();
const obsImg = new Image();
const birdImg = new Image();
const sound = { jumpSound: "./sound/yasuo.mp3", die: "./sound/die.mp3" };
dinoImg.src = "./img/yasuo.png";
obsImg.src = "./img/minions.png";
birdImg.src = "./img/bird.png";
let alertDisplay = false;
let dinoMove = 5;
let score = 0;
let obsSpawn = false;
let obsSpeed = 3.5;
let obsX = canvas?.clientWidth - obsSize;
let obsFinal = canvas?.clientLeft;
let dinoY = groundY;
let birdY = canvas?.clientHeight / 2;
let birdSize = 30;
let birdFlySpeed = 2.5;
let birdX = canvas?.clientWidth - birdSize;
let birdUP = birdY - 40;
let birdDown = birdY + 40;
let birdFly = true;
let dinoJump = {
  heightJump: canvas.clientHeight / 2,
  isJump: false,
  isJumpMax: false,
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGround();
  drawDino();
  randomSpawn();
  drawBird();
  drawScore(score);
  generateScore();
  birdCollision();

  if (obsSpawn) {
    collisionDetection();
    drawObstacle();
  }

  if (dinoJump.isJump) {
    jumpDino();
  }

  requestAnimationFrame(draw);
};

const drawGround = () => {
  ctx.beginPath();
  ctx.rect(groundX, groundY, groundWidth, groundHeight);
  ctx.fillStyle = "#78350f";
  ctx.fill();
  ctx.closePath();
};

const randomSpawn = () => {
  // @ts-ignore
  const random = Math.floor(Math.random() * 1500);
  if (random === 25) {
    obsSpawn = true;
  }
};

const drawDino = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "red";
  ctx.strokeRect(dinoX, dinoY - dinoSize, dinoSize, dinoSize);
  ctx.drawImage(dinoImg, dinoX, dinoY - dinoSize, dinoSize, dinoSize);
};
const drawObstacle = () => {
  horizontalScroll();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "red";
  ctx.strokeRect(obsX, obsY, obsSize, obsSize);
  ctx.drawImage(obsImg, obsX, obsY, obsSize, obsSize);
};

const drawBird = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "red";
  ctx.strokeRect(birdX, birdY - birdSize, birdSize, birdSize);
  ctx.drawImage(birdImg, birdX, birdY - birdSize, birdSize, birdSize);
  flyBird();
};

const flyBird = () => {
  if (birdFly) {
    if (birdY === birdUP) {
      birdFly = false;
    }
    birdY--;
  } else {
    if (birdY === birdDown) {
      birdFly = true;
    }
    birdY++;
  }

  if (birdX < groundWidth && birdX > -1) {
    birdX -= birdFlySpeed;
  } else if (birdX <= -1) {
    birdX = canvas?.clientWidth - birdSize;
  }
};

const collisionDetection = () => {
  if (dinoY > obsY && dinoX + dinoSize > obsX) {
    if (!alertDisplay) {
      alert(`Perdu vous avez fait : ${score} points! `);
      alertDisplay = true;
      document.location.reload();
    }
  }
};

const birdCollision = () => {
  if (dinoY - dinoSize < birdY && dinoX + dinoSize > birdX) {
    if (!alertDisplay) {
      alert(`Perdu vous avez fait : ${score} points! `);
      alertDisplay = true;
      document.location.reload();
      console.log("perdu");
    }
  }
};

const generateScore = () => {
  if (obsX <= -1) {
    obsSpawn = false;
    obsX = canvas?.clientWidth - obsSize;
  }

  if (birdX <= -1) {
    score += 1;
  }
};

const jumpDino = () => {
  if (dinoY >= dinoJump.heightJump && dinoJump.isJump && !dinoJump.isJumpMax) {
    if (dinoY === dinoJump.heightJump) dinoJump.isJumpMax = true;
    dinoY -= dinoMove;
  } else if (
    dinoY <= groundY - dinoMove &&
    dinoJump.isJump &&
    dinoJump.isJumpMax
  ) {
    dinoY += dinoMove;
  } else {
    dinoJump.isJumpMax = false;
    dinoJump.isJump = false;
  }
};

const playSound = (src) => {
  const audio = new Audio(src);
  audio.play();
};

const drawScore = (point) => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#334155";
  ctx.fillText(`Score : ${point}`, 10, 20);
};

const horizontalScroll = () => {
  if (obsX < groundWidth && obsX > -1) {
    obsX -= obsSpeed;
  } else if (obsX <= -1) {
  }
};

document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "ArrowUp") {
    dinoJump.isJump = true;
    if (dinoY !== groundY) return;
    playSound(sound.jumpSound);
    jumpDino();
  }
});

draw();
