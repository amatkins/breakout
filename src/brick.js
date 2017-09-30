export default class Brick {
  constructor(x, y, size = 1, canBreak = true, maxLife = 1, colors = ["white"]) {
    // Basic attributes of the brick.
    this.canBreak = canBreak;
    this.colors = colors;
    this.maxLife = maxLife;
    this.currLife = maxLife;
    this.loc = { x: x, y: y };
    this.size = size;

    // Bind the methods to this class.
    this.render = this.render.bind(this);
  }

  render(ctx, cellSize) {
    var colorIndex;

    colorIndex = Math.round((this.currLife / this.maxLife) * this.colors.length - 1);

    ctx.fillStyle = this.colors[colorIndex];
    ctx.fillRect(this.loc.x * cellSize, this.loc.y * cellSize, this.size * cellSize, cellSize);
  }
}
