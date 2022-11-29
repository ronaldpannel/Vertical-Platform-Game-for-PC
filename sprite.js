class Sprite {
  constructor({ pos, imageSrc, frameRate = 1, frameBuffer = 3, scale = 1 }) {
    this.pos = pos;
    this.scale = scale;
    this.loaded = false;
    this.image = new Image();
    this.image.onload = () => {
      this.width = (this.image.width / this.frameRate) * this.scale;
      this.height = this.image.height * scale;
      this.loaded = true;
    };
    this.image.src = imageSrc;
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.frameBuffer = frameBuffer;
    this.elapsedFrames = 0;
  }
  draw() {
    if (!this.image) return;
    const cropBox = {
      pos: {
        x: (this.currentFrame * this.image.width) / this.frameRate,
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    };
    ctx.drawImage(
      this.image,
      cropBox.pos.x,
      cropBox.pos.y,
      cropBox.width,
      cropBox.height,
      this.pos.x,
      this.pos.y,
      this.width,
      this.height
    );
  }
  update() {
    this.draw();
    this.updateFrames();
  }
  updateFrames() {
    this.elapsedFrames++;
    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }
}
