/* brick.js */

export default class Brick {
  /** @constructor
   * Constructs a new instance of a brick.
   * @param  {Integer}  x               The left edge of the brick.
   * @param  {Integer}  y               The top edge of the brick.
   * @param  {Integer}  width           The width of the brick.
   * @param  {Integer}  height          The height of the brick.
   * @param  {Boolean} canBreak         Whether or not the brick can break.
   * @param  {Integer}  maxLife         The initial life value.
   * @param  {Array}   worth            The list of point values.
   * @param  {Array}   colors           The list of color values.
   */
  constructor(x, y, width, height, canBreak = true, maxLife = 1, worth = [1], colors = ["red"]) {
    // Basic attributes of the brick.
    this.canBreak = canBreak;
    this.colors = colors;
    this.currLife = maxLife;
    this.hitBox = {
      x: x,
      y: y,
      w: width,
      h: height
    };
    this.maxLife = maxLife;
    this.worth = worth;

    // Bind the methods to this class.
    this.getScore = this.getScore.bind(this);
    this.clamp = this.clamp.bind(this);
    this.render = this.render.bind(this);
    this.update = this.update.bind(this);
  }

  /** @function getScore
   * Gets the score for hitting the brick at it's current life value.
   * @return {Integer}  The score of hitting the brick.
   */
  getScore() {
    if (this.canBreak)
      return this.worth[Math.round((this.currLife / this.maxLife) * this.worth.length - 1)];

    return 0;
  }

  /** @function clamp
   * Returns the nearest point in the range of the brick to the the specified position.
   * @param  {Integer} x The x coord of the position.
   * @param  {Integer} y The y coord of the position.
   * @return {Object}   The clamped point.
   */
  clamp(x, y) {
    return {
      x: Math.min(Math.max(x, this.hitBox.x), this.hitBox.x + this.hitBox.w - 1),
      y: Math.min(Math.max(y, this.hitBox.y), this.hitBox.y + this.hitBox.h - 1)
    };
  }

  /** @function update
   * Updates the bricks life.
   * @return {Boolean} Whether or not the brick broke.
   */
  update() {
    if (this.canBreak) {
      this.currLife--;

      if (this.currLife === 0)
        return true;
    }

    return false;
  }

  /** @function render
   * Renders the brick on the stage.
   * @param  {[type]} ctx The back buffer context.
   */
  render(ctx) {
    let colorIndex;

    if (this.canBreak) {
      colorIndex = Math.round((this.currLife / this.maxLife) * this.colors.length - 1);
      ctx.fillStyle = this.colors[colorIndex];
    }
    else
      ctx.fillStyle = "grey";
    ctx.strokeStyle = "white";

    ctx.fillRect(this.hitBox.x + 2, this.hitBox.y + 2, this.hitBox.w - 4, this.hitBox.h - 4);
    ctx.strokeRect(this.hitBox.x + 2, this.hitBox.y + 2, this.hitBox.w - 4, this.hitBox.h - 4);
  }
}
