/* paddle.js */

export default class Paddle {
  /** @constructor
   * Constructs a new instance of a paddle.
   * @param  {Integer} x      The left edge of the paddle.
   * @param  {Integer} y      The top edge of the paddle.
   * @param  {Integer} width  The width of the paddle.
   * @param  {Integer} height The height of the paddle.
   * @param  {Integer} speed  The speed of the paddle.
   */
  constructor(x, y, width, height, speed) {
    this.direction = "idle";
    this.hitBox = {
      x: x,
      y: y,
      w: width,
      h: height
    };
    this.speed = { cur: 0, max: speed };

    this.clamp = this.clamp.bind(this);
    this.inputLeft = this.inputLeft.bind(this);
    this.inputRight = this.inputRight.bind(this);
    this.inputRelease = this.inputRelease.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }

  /** @function clamp
   * Returns the nearest point in the range of the paddle to the the specified position.
   * @param  {Integer} x The x coord of the position.
   * @param  {Integer} y The y coord of the position.
   * @return {Object}    The clamped point and infomration about the paddle.
   */
  clamp(x, y) {
    return {
      x: Math.min(Math.max(x, this.hitBox.x), this.hitBox.x + this.hitBox.w - 1),
      y: Math.min(Math.max(y, this.hitBox.y), this.hitBox.y + this.hitBox.h - 1),
      dir: this.direction,
      speed: this.speed.cur / this.speed.max
    };
  }

  /** @function inputLeft
   * Changes the paddle's direction to left.
   */
  inputLeft() {
    this.direction = "left";
  }

  /** @function inputRight
   * Changes the paddle's direction to right.
   */
  inputRight() {
    this.direction = "right";
  }

  /** @function inputRelease
   * Changes the the padle's direction to idle if it is.
   * @param  {String} dir The direction that was released.
   */
  inputRelease(dir) {
    if (this.direction === dir)
      this.direction = "idle";
  }

  /** @function update
   * Updates the paddle's position.
   * @param  {Integer} width The width of the stage.
   */
  update(width) {
    switch (this.direction) {
      case "right":
        if (this.speed.cur < this.speed.max)
          this.speed.cur++;
        break;
      case "left":
        if (this.speed.cur > -this.speed.max)
          this.speed.cur--;
        break;
      case "idle":
      default:
        if (this.speed.cur !== 0)
          this.speed.cur += (this.speed.cur > 0 ? -2: 2);
        break;
    }
    this.hitBox.x += Math.min(Math.max(Math.round(this.speed.cur / this.speed.max * 8), -this.hitBox.x), width - this.hitBox.x - this.hitBox.w - 1);
  }

  /** @function
   * Renders the paddle on the stage.
   * @param  {Context} ctx The back buffer context.
   */
  render(ctx) {
    ctx.fillStyle = "grey";
    ctx.strokeStyle = "orange";

    ctx.fillRect(this.hitBox.x, this.hitBox.y, this.hitBox.w, this.hitBox.h);
    ctx.strokeRect(this.hitBox.x, this.hitBox.y, this.hitBox.w, this.hitBox.h);
  }
}
