/**@type{HTMLCanvasElement} */
// Game Setup

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};
//Floor Collision Blocks
const floorCollisions2d = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2d.push(floorCollisions.slice(i, i + 36));
}

const collisionBlocks = [];
floorCollisions2d.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      collisionBlocks.push(
        new CollisionBlock({
          pos: {
            x: x * 16,
            y: y * 16,
          },
        })
      );
    }
  });
});

//Platform Collision Blocks
const platformCollisions2d = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2d.push(platformCollisions.slice(i, i + 36));
}

const platformCollisionBlocks = [];
platformCollisions2d.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          pos: {
            x: x * 16,
            y: y * 16,
          },
          height: 4,
        })
      );
    }
  });
});

let gravity = 0.1;

const player = new Player({
  pos: {
    x: 100,
    y: 300,
  },
  collisionBlocks: collisionBlocks,
  platformCollisionBlocks: platformCollisionBlocks,
  imageSrc: "Idle.png",
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: "Idle.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    Run: {
      imageSrc: "Run.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    Jump: {
      imageSrc: "Jump.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    Fall: {
      imageSrc: "Fall.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    FallLeft: {
      imageSrc: "FallLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    RunLeft: {
      imageSrc: "RunLeft.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    IdleLeft: {
      imageSrc: "IdleLeft.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    JumpLeft: {
      imageSrc: "JumpLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
  },
});

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

const background = new Sprite({
  pos: {
    x: 0,
    y: 0,
  },
  imageSrc: "background.png",
});
const backgroundImageHeight = 432;
const camera = {
  pos: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

function animate() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(4, 4);
  ctx.translate(camera.pos.x, camera.pos.y);
  background.update();
  // collisionBlocks.forEach((collisionBlock) => {
  //   collisionBlock.update();
  // });

  // platformCollisionBlocks.forEach((collisionBlock) => {
  //   collisionBlock.update();
  // });
  player.checkForHorizontalCanvasCollision();
  player.update();

  player.vel.x = 0;
  if (keys.d.pressed) {
    player.switchSprite("Run");
    player.vel.x = 2;
    player.lastDirection = "right";
    player.shouldPanCameraToLeft({ canvas, camera });
  } else if (keys.a.pressed) {
    player.switchSprite("RunLeft");
    player.vel.x = -2;
    player.lastDirection = "left";
    player.shouldPanCameraToRight({ camera, canvas });
  } else if (player.vel.y === 0) {
    if (player.lastDirection === "right") player.switchSprite("Idle");
    else player.switchSprite("IdleLeft");
  }

  if (player.vel.y < 0) {
    player.shouldPanCameraDown({ camera, canvas });
    if (player.lastDirection === "right") player.switchSprite("Jump");
    else player.switchSprite("JumpLeft");
  } else if (player.vel.y > 0) {
    player.shouldPanCameraUp({ camera, canvas });
    if (player.lastDirection === "right") player.switchSprite("Fall");
    else player.switchSprite("FallLeft");
  }
  ctx.restore();

  requestAnimationFrame(animate);
}
animate();
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "w":
      player.vel.y = -4;
      break;

    default:
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    default:
      break;
  }
});
