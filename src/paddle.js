export default class Paddle {
  constructor(x, width, speed) {
    this.x = x;
    this.width = width;
    this.speed = speed;

    this.render = this.render.bind(this);
  }

  render(ctx, width, height, cellSize) {
    ctx.fillStyle = "grey";

    ctx.fillRect(this.x, height * cellSize, this.width * cellSize, cellSize / 2);
  }
}
