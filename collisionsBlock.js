class CollisionBlock {
  constructor({ pos, height = 16 }) {
    this.pos = pos;
    this.width = 16;
    this.height = height;
  }
  draw() {
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  }
  update() {
    this.draw();
  }
}
