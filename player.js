class Player extends Sprite {
  constructor({
    pos,
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc,
    frameRate,
    scale = 0.5,
    animations,
  }) {
    super({ imageSrc, frameRate, scale });
    this.pos = pos;
    this.vel = {
      x: 0,
      y: 1,
    };
    this.collisionBlocks = collisionBlocks;
    this.platformCollisionBlocks = platformCollisionBlocks;
    this.color = "red";
    this.hitBox = {
      pos: {
        x: this.pos.x,
        y: this.pos.y,
      },
      width: 10,
      height: 10,
    };
    this.animations = animations;
    this.lastDirection = "right";

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;

      this.animations[key].image = image;
    }
    this.cameraBox = {
      pos: {
        x: this.pos.x,
        y: this.pos.y,
      },
      width: 200,
      height: 80,
    };
  }
  switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return;
    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.frameRate = this.animations[key].frameRate;
  }
  updateCameraBox() {
    this.cameraBox = {
      pos: {
        x: this.pos.x - 50,
        y: this.pos.y,
      },
      width: 200,
      height: 80,
    };
  }
  checkForHorizontalCanvasCollision() {
    if (
      this.hitBox.pos.x + this.hitBox.width + player.vel.x >= 576 ||
      this.hitBox.pos.x + this.vel.x <= 0
    ) {
      this.vel.x = 0;
    }
  }
  shouldPanCameraToLeft({ camera, canvas }) {
    const cameraBoxRightSide = this.cameraBox.pos.x + this.cameraBox.width;
    const scaleDownCanvasWidth = canvas.width / 4;

    if (cameraBoxRightSide >= 576) return;

    if (cameraBoxRightSide >= scaleDownCanvasWidth + Math.abs(camera.pos.x)) {
      camera.pos.x -= this.vel.x;
    }
  }
  shouldPanCameraToRight({ camera, canvas }) {
    if (this.cameraBox.pos.x <= 0) return;

    if (this.cameraBox.pos.x <= Math.abs(camera.pos.x)) {
      camera.pos.x -= this.vel.x;
    }
  }
  shouldPanCameraDown({ camera, canvas }) {
    if (this.cameraBox.pos.y + this.vel.y <= 0) return;

    if (this.cameraBox.pos.y <= Math.abs(camera.pos.y)) {
      camera.pos.y -= this.vel.y;
    }
  }

  shouldPanCameraUp({ camera, canvas }) {
    if ((this.cameraBox.pos.y + this.cameraBox.height + this. vel.y <= 432))
      return;

    const scaledCanvasHeight = canvas.height / 4;

    if (
      this.cameraBox.pos.y + this.cameraBox.height >=
      Math.abs(camera.pos.y + scaledCanvasHeight)
    ) {
      camera.pos.y -= this.vel.y;
    }
  }
  update() {
    this.updateFrames();
    this.updateHitBox();
    this.updateCameraBox();

    //draws image
    // ctx.fillStyle = "rgba(0,0,255, 0.3)";
    // ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    //camera Box
    // ctx.fillStyle = "rgba(0,0,255, 0.5)";
    // ctx.fillRect(
    //   this.cameraBox.pos.x,
    //   this.cameraBox.pos.y,
    //   this.cameraBox.width,
    //   this.cameraBox.height
    // );
    //draws hit box
    // ctx.fillStyle = "rgba(0,255,0, 0.5)";
    // ctx.fillRect(
    //   this.hitBox.pos.x,
    //   this.hitBox.pos.y,
    //   this.hitBox.width,
    //   this.hitBox.height
    // );
    this.draw();
    this.pos.x += this.vel.x;
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitBox();
    this.checkForVerticalCollisions();
  }
  updateHitBox() {
    this.hitBox = {
      pos: {
        x: this.pos.x + 35,
        y: this.pos.y + 26,
      },
      width: 14,
      height: 27,
    };
  }
  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        collision({
          object1: this.hitBox,
          object2: collisionBlock,
        })
      ) {
        if (this.vel.x > 0) {
          this.vel.x = 0;
          const offset = this.hitBox.pos.x - this.pos.x + this.hitBox.width;
          this.pos.x = collisionBlock.pos.x - offset - 0.01;
          break;
        }
        if (this.vel.x < 0) {
          this.vel.x = 0;

          const offset = this.hitBox.pos.x - this.pos.x;
          this.pos.x =
            collisionBlock.pos.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }
  applyGravity() {
    this.vel.y += gravity;
    this.pos.y += this.vel.y;
  }
  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        collision({
          object1: this.hitBox,
          object2: collisionBlock,
        })
      ) {
        if (this.vel.y > 0) {
          this.vel.y = 0;
          const offset = this.hitBox.pos.y - this.pos.y + this.hitBox.height;
          this.pos.y = collisionBlock.pos.y - offset - 0.01;
          break;
        }
        if (this.vel.y < 0) {
          this.vel.y = 0;
          const offset = this.hitBox.pos.y - this.pos.y;
          this.pos.y =
            collisionBlock.pos.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }

    //Platform Collision Blocks

    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i];

      if (
        platformCollision({
          object1: this.hitBox,
          object2: platformCollisionBlock,
        })
      ) {
        if (this.vel.y > 0) {
          this.vel.y = 0;
          const offset = this.hitBox.pos.y - this.pos.y + this.hitBox.height;
          this.pos.y = platformCollisionBlock.pos.y - offset - 0.01;
          break;
        }
      }
    }
  }
}
