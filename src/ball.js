/* ball.js */

export default class Ball {
  /** @constructor
   * Constructs a new ball.
   * @param  {[type]} x      The x coord of the center.
   * @param  {[type]} y      The y coord of the center.
   * @param  {[type]} radius The radius of the ball.
   * @param  {[type]} angle  The angle the ball is traveling in.
   * @param  {[type]} speed  The speed the ball is traveling at.
   * @param  {[type]} lives  The lives the ball has.
   */
  constructor(x, y, radius,  angle, speed, maxSpeed, lives) {
    this.hitBox = {
      x: x,
      y: y,
      r: radius
    };
    this.lives = lives;
    this.spawn = {
      x: x,
      y: y
    };
    this.velocity = { angle: angle, speed: speed };
    this.maxSpeed = maxSpeed;

    this.checkBounds = this.checkBounds.bind(this);
    this.checkDirLoc = this.checkDirLoc.bind(this);
    this.checkHit = this.checkHit.bind(this);
    this.incLives = this.incLives.bind(this);
    this.correctPath = this.correctPath.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }

  /** @function checkBounds
   * Check if the ball is within the bounds of the stage.
   * @param  {Integer} width  The width of the stage.
   * @param  {Integer} height The height of the stage.
   * @return {String}         The side of the stage the ball hit.
   */
  checkBounds(width, height) {
    if (this.hitBox.x - this.hitBox.r < 0)
      return "left";
    else if (this.hitBox.x + this.hitBox.r > width)
      return "right";
    else if (this.hitBox.y - this.hitBox.r < 0)
      return "top";
    else if (this.hitBox.y + this.hitBox.r > height)
      return "bottom";
    else
      return "none";
  }

  /** @function checkDirLoc
   * Check if the ball is in the specified region.
   * @param  {Integer} low  The low point of the region.
   * @param  {Integer} high The high point of the region.
   * @return {Boolean}      Whether or not the ball is in the region.
   */
  checkDirLoc(low, high) {
    return this.hitBox.y - this.hitBox.r < high && this.hitBox.y + this.hitBox.r > low;
  }

  /** @function checkHit
   * Check if the specified location qualifies as a "hit".
   * @param  {Object} loc  The location to check for a hit.
   * @return {Boolean}     Whether or not the ball hit something.
   */
  checkHit(loc) {
    return (loc.x - this.hitBox.x) ** 2 + (loc.y - this.hitBox.y) ** 2 < this.hitBox.r ** 2;
  }

  /** @function incLives
   * Kills the ball and sends it back to spawn.
   * @return {Boolean} Whether or not the ball ran out of lives.
   */
  incLives() {
    this.lives--;

    this.hitBox.x = this.spawn.x;
    this.hitBox.y = this.spawn.y;
    this.velocity.angle = Math.round(Math.random() * 140 + 200);

    return this.lives === 0;
  }

  /** @function correctPath
   * Correct's the ball's location and angle if it is intersecting an object.
   * @param  {[type]} hitSpot The spot of intersection.
   */
  correctPath(hitSpot) {
    let dis, alt;

    dis = {
      x: 0,
      y: 0
    };

    if (hitSpot.x > this.hitBox.x) {
      if (hitSpot.y > this.hitBox.y) {
        // hit top left corner
        dis.x = -2 * (this.hitBox.x + this.hitBox.r - hitSpot.x);
        dis.y = -2 * (this.hitBox.y + this.hitBox.r - hitSpot.y);

        if (Math.abs(dis.x) < Math.abs(dis.y)) {
          dis.y = 0;

          this.velocity.angle = (540 - this.velocity.angle) % 360;
        } else {
          dis.x = 0;

          this.velocity.angle = Math.max(Math.min(360 - this.velocity.angle, 345), 195);
        }
      } else if (hitSpot.y < this.hitBox.y) {
        // hit bottom left corner
        dis.x = -2 * (this.hitBox.x + this.hitBox.r - hitSpot.x);
        dis.y = -2 * (this.hitBox.y - this.hitBox.r - hitSpot.y);

        if (Math.abs(dis.x) < Math.abs(dis.y)) {
          dis.y = 0;

          this.velocity.angle = (540 - this.velocity.angle) % 360;
        } else {
          dis.x = 0;

          this.velocity.angle = Math.max(Math.min(360 - this.velocity.angle, 165), 15);
        }
      } else {
        // hit left side
        dis.x = -2 * (this.hitBox.x + this.hitBox.r - hitSpot.x);

        this.velocity.angle = (540 - this.velocity.angle) % 360;
      }
    } else if (hitSpot.x < this.hitBox.x) {
      if (hitSpot.y > this.hitBox.y) {
        // hit top right corner
        dis.x = -2 * (this.hitBox.x - this.hitBox.r - hitSpot.x);
        dis.y = -2 * (this.hitBox.y + this.hitBox.r - hitSpot.y);

        if (Math.abs(dis.x) < Math.abs(dis.y)) {
          dis.y = 0;

          this.velocity.angle = (540 - this.velocity.angle) % 360;
        } else {
          dis.x = 0;

          this.velocity.angle = Math.max(Math.min(360 - this.velocity.angle, 345), 195);
        }
      } else if (hitSpot.y < this.hitBox.y) {
        // hit bottom right corner
        dis.x = -2 * (this.hitBox.x - this.hitBox.r - hitSpot.x);
        dis.y = -2 * (this.hitBox.y - this.hitBox.r - hitSpot.y);

        if (Math.abs(dis.x) < Math.abs(dis.y)) {
          dis.y = 0;

          this.velocity.angle = (540 - this.velocity.angle) % 360;
        } else {
          dis.x = 0;

          this.velocity.angle = Math.max(Math.min(360 - this.velocity.angle, 165), 15);
        }
      } else {
        // hit right side
        dis.x = -2 * (this.hitBox.x - this.hitBox.r - hitSpot.x);

        this.velocity.angle = (540 - this.velocity.angle) % 360;
      }
    } else {
      if (hitSpot.y > this.hitBox.y) {
        // hit top side
        dis.y = -2 * (this.hitBox.y + this.hitBox.r - hitSpot.y);

        switch (hitSpot.dir) {
          case "left":
            alt = Math.round(-hitSpot.speed * (315 - Math.max(Math.min(360 - this.velocity.angle, 315), 195)));
            break;
          case "right":
            alt = Math.round(-hitSpot.speed * (Math.max(Math.min(360 - this.velocity.angle, 345), 225) - 225));
            break;
          case "idle":
          default:
            alt = 0;
            break;
        }

        this.velocity.angle = Math.max(Math.min(360 - this.velocity.angle, 345), 195) + alt;
      } else if (hitSpot.y < this.hitBox.y) {
        // hit bottom side
        dis.y = -2 * (this.hitBox.y - this.hitBox.r - hitSpot.y);

        this.velocity.angle = Math.max(Math.min(360 - this.velocity.angle, 165), 15);
      }
    }

    if (this.velocity.angle > 255 && this.velocity.angle < 285)
      this.velocity.angle += Math.round(Math.random() * 30 - 15);

    this.hitBox.x = this.hitBox.x + dis.x;
    this.hitBox.y = this.hitBox.y + dis.y;
  }

  /** @function update
   * Updates the ball's location.
   * @param {Integer} accel increease in speed becasue of broken bricks.
   */
  update(accel) {
    this.hitBox.x = Math.round(this.hitBox.x + (accel * (this.maxSpeed - this.velocity.speed) + this.velocity.speed) * Math.cos(this.velocity.angle * Math.PI / 180));
    this.hitBox.y = Math.round(this.hitBox.y + (accel * (this.maxSpeed - this.velocity.speed) + this.velocity.speed) * Math.sin(this.velocity.angle * Math.PI / 180));
  }

  /** @function render
   * Renders the ball on the stage.
   * @param  {Context} ctx The back buffer context.
   */
  render(ctx) {
    ctx.fillStyle = "grey";
    ctx.strokeStyle = "orange";

    ctx.beginPath();
    ctx.arc(this.hitBox.x, this.hitBox.y, this.hitBox.r, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }
}
