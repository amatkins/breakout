export default class Ball {
  constructor(x, y, angle, speed) {
    this.position = { x: x, y: y };
    this.vector = { angle: angle, speed: speed };

    this.render = this.render.bind(this);
  }

  render(ctx, cellSize) {
    var radius = (cellSize - (0.2 * cellSize)) / 2;

    ctx.fillStyle = "grey";

    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
  }
}
