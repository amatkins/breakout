/* controller.js */

import Brick from './brick';
import Paddle from './paddle';
import Ball from './ball';
import sfx from './media/index';

export default class Controller {
  /** @constructor
   * Creates a new game controller for a clone of Atari Breakout.
   * @param  {Array} layouts A set of level layouts.
   */
  constructor(layouts) {
    // Basic attributes of the controller.
    this.breakables = 0;
    this.bricks = [];
    this.cellSize = 48;
    this.height = 0;
    this.highScore = 0;
    this.layouts = layouts;
    this.level = 0;
    this.maxBreakable = 0;
    this.speed = 28;
    this.state = "paused";
    this.score = 0;
    this.width = 0;

    // Initial setup of board.
    this.setup(layouts[this.level]);
    this.paddle = new Paddle(
      (this.width * this.cellSize) / 2 - this.cellSize,
      this.height * this.cellSize,
      2 * this.cellSize,
      this.cellSize / 2,
      this.speed / 2
    );
    this.ball = new Ball(
      (this.width * this.cellSize) / 2,
      (this.height - 0.5) * this.cellSize,
      (this.cellSize - (0.2 * this.cellSize)) / 2,
      Math.round(Math.random() * 6) * 15 + 225,
      this.cellSize / 9,
      this.cellSize / 5,
      3
    );

    // The display part of the buffer.
    this.screen = document.createElement("canvas");
    this.screen.width = this.width * this.cellSize;
    this.screen.height = (this.height + 1) * this.cellSize;
    document.body.appendChild(this.screen);
    this.screenCTX = this.screen.getContext("2d");

    // The back part of the buffer.
    this.back = document.createElement("canvas");
    this.back.width = this.width * this.cellSize;
    this.back.height = (this.height + 1) * this.cellSize;
    this.backCTX = this.back.getContext("2d");

    // Add audio to the page
    this.player = document.createElement("audio");

    // Bind the methods to this class.
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.reset = this.reset.bind(this);
    this.setup = this.setup.bind(this);
    this.checkBricks = this.checkBricks.bind(this);
    this.checkPaddle = this.checkPaddle.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.loop = this.loop.bind(this);
    this.pause = this.pause.bind(this);
    this.unpause = this.unpause.bind(this);

    // Bind the appropriate methods to their event listeners.
    window.onkeydown = this.handleKeyDown;
    window.onkeyup = this.handleKeyUp;

    // First rendering of game.
    this.render(`!Hit [P] To Start Game!`);
  }

  /** @function handleKeyDown
   *  Handles user input on key downs.
   *  @param  {Object} event The key down event that occured.
   */
  handleKeyDown(event) {
    event.preventDefault();

    switch (String.fromCharCode(event.keyCode)) {
      case 'A':
        this.paddle.inputLeft();
        break;
      case 'D':
        this.paddle.inputRight();
        break;
      case 'P':
        switch (this.state) {
          case "running":
            this.pause();
            break;
          case "paused":
            this.unpause();
            break;
          case "over":
            this.reset(true);
            break;
          default:
            return;
        }
        break;
      default:
        return;
    }
  }

  /** @function handleKeyUp
   * Changes the paddle based on user input release.
   * @param  {Object} event The event that raised the input release
   */
  handleKeyUp(event) {
    event.preventDefault();

    switch (String.fromCharCode(event.keyCode)) {
      case 'A':
        this.paddle.inputRelease("left");
        break;
      case 'D':
        this.paddle.inputRelease("right");
        break;
      default:
        return;
    }
  }

  /** @function reset
   * Either does a soft or hard reset of the game.
   * @param {Boolean} full If full start from beginning, otherwise start next level.
   */
  reset(full) {
    this.speed = 18;
    this.state = "paused";
    this.highScore = (this.score > this.highScore ? this.score : this.highScore)
    this.score = (full ? 0 : this.score);
    if (full)
      this.level = 0;
    else
      this.level = (this.level + 1) % this.layouts.length;

    // Initial setup of board.
    this.setup(this.layouts[this.level]);
    this.paddle = new Paddle(
      (this.width * this.cellSize) / 2 - this.cellSize,
      this.height * this.cellSize,
      2 * this.cellSize,
      this.cellSize / 2,
      this.speed / 2
    );
    this.ball = new Ball(
      (this.width * this.cellSize) / 2,
      (this.height - 0.5) * this.cellSize,
      (this.cellSize - (0.2 * this.cellSize)) / 2,
      Math.round(Math.random() * 90 + 225),
      this.cellSize / 9,
      this.cellSize / 5,
      3
    );

    this.screen.width = this.width * this.cellSize;
    this.screen.height = (this.height + 1) * this.cellSize;
    this.screenCTX = this.screen.getContext("2d");

    this.back.width = this.width * this.cellSize;
    this.back.height = (this.height + 1) * this.cellSize;
    this.backCTX = this.back.getContext("2d");

    // First rendering of game.
    this.render(`!Hit [P] to Start Game!`);
  }

  /** @function setup
   * Setups the bricks and determines the stage size.
   * @param  {Array} layout The layout to set the bricks up in.
   */
  setup(layout) {
    let lastRow, nextLoc, maxWidth;

    // Initialize relevant attributes
    this.bricks = [];
    this.breakables = 0;
    this.maxBreakable = 0;
    lastRow = 0;
    maxWidth = 0;

    // Loop through templates
    layout.forEach((row) => {
      this.bricks.push([]);
      nextLoc = 0;

      row.forEach((template) => {
        if (template.isBrick) {
          // Add the new brick
          this.bricks[lastRow].push(
            new Brick(
              nextLoc * this.cellSize,
              lastRow * this.cellSize,
              template.size * this.cellSize,
              this.cellSize,
              template.canBreak,
              template.life,
              template.worth,
              template.colors)
          );

          // Increase count of breakable objects if breakable
          if (template.canBreak)
            this.breakables++;
        }

        // Increase next available location pointer
        nextLoc += template.size;
      });
      // Determine if the width has changed
      if (nextLoc > maxWidth)
        maxWidth = nextLoc;

      // Increment row counter
      lastRow++;
    });

    this.maxBreakable = this.breakables;

    // Set the size of the stage
    this.width = maxWidth;
    this.height = layout.length + 4;
  }

  /** @function checkBricks
   * Check if any of the bricks have been hit.
   * @return {Object} Information about the bricks relative to the ball.
   */
  checkBricks() {
    let closest;

    for (let r = 0; r < this.bricks.length; r++) {
      if (this.ball.checkDirLoc(r * this.cellSize, (r + 1) * this.cellSize)) {
        for (let i = 0; i < this.bricks[r].length; i++) {
          closest = this.bricks[r][i].clamp(this.ball.hitBox.x, this.ball.hitBox.y);

          if (this.ball.checkHit(closest))
            return { loc: { x: i, y: r }, hitSpot: closest };
        }
      }
    }
  }

  /** @function checkPaddle
   * Determine if the paddle has been hit.
   * @return {Object} Information about the paddle relative to the ball
   */
  checkPaddle() {
    let loc;

    loc = this.paddle.clamp(this.ball.hitBox.x, this.ball.hitBox.y);

    if (this.ball.checkHit(loc))
      return loc;
  }

  /** @function update
   * Updates all the active objects in the stage.
   */
  update() {
    let bri, pad, changed;

    // Initial update of the paddle and ball
    this.paddle.update(this.width * this.cellSize);
    this.ball.update((this.maxBreakable - this.breakables) / this.maxBreakable);

    do {
      bri = null;
      pad = null;
      changed = false;

      // Check if any of the bricks have been hit
      if (this.ball.checkDirLoc(0, (this.height - 3) * this.cellSize))
        bri = this.checkBricks();

      if (bri) {
        // Increase score if possible
        this.score += this.bricks[bri.loc.y][bri.loc.x].getScore();

        // Update brick if possible
        if (this.bricks[bri.loc.y][bri.loc.x].update()) {
          // Play break sound
          this.player.src = sfx.break;
          this.player.play();

          this.bricks[bri.loc.y].splice(bri.loc.x, 1);
          this.breakables--;
          if (this.breakables === 0) {
            this.state = "next";
            return;
          }
        } else {
          // Play crack sound
          this.player.src = sfx.crack;
          this.player.play();
        }

        // Correct ball
        this.ball.correctPath(bri.hitSpot);
        changed = true;
      } else {
        // Check if the paddle has been hit
        if (this.ball.checkDirLoc((this.height) * this.cellSize, (this.height + 1) * this.cellSize))
          pad = this.checkPaddle();

        if (pad) {
          // play paddle bounce sound
          this.player.src = sfx.paddleBounce;
          this.player.play();

          // Correct the ball
          this.ball.correctPath(pad);
          changed = true;
        } else {
          // Check if any of the bounding walls have been hit and correct if so
          switch (this.ball.checkBounds(this.width * this.cellSize, (this.height + 0.5) * this.cellSize)) {
              case "left":
                // Play wall bounce sound
                this.player.src = sfx.wallBounce;
                this.player.play();

                this.ball.correctPath({ x: 0, y: this.ball.hitBox.y });
                changed = true;
                break;
              case "right":
                // Play wall bounce sound
                this.player.src = sfx.wallBounce;
                this.player.play();

                this.ball.correctPath({ x: this.width * this.cellSize, y: this.ball.hitBox.y });
                changed = true;
                break;
              case "top":
                // Play wall bounce sound
                this.player.src = sfx.wallBounce;
                this.player.play();

                this.ball.correctPath({ x: this.ball.hitBox.x, y: 0 });
                changed = true;
                break;
              case "bottom":
                // Play death sound
                this.player.src = sfx.death;
                this.player.play();

                // Die if fell out of bottom, end game if lives = 0
                if (this.ball.incLives())
                  this.state = "over";
                else
                  this.pause();
                break;
              case "none":
              default:
                return;
          }
        }
      }
    } while (changed);
  }

  /** @function render
   * Renders the screen and all objects.
   * @param  {String} screenText status specific information to display.
   */
  render(screenText = ``) {
    var gameText, gameTextDim, screenTextDim;

    // fill screen
    this.backCTX.save();
    this.backCTX.fillStyle = "black";
    this.backCTX.fillRect(0, 0,
      this.width * this.cellSize,
      (this.height + 1) * this.cellSize);
    this.backCTX.restore();

    // Render the bricks
    this.bricks.forEach((row) => {
      row.forEach((brick) => {
        this.backCTX.save();
        brick.render(this.backCTX);
        this.backCTX.restore();
      });
    });

    // Render the paddle
    this.backCTX.save();
    this.paddle.render(this.backCTX);
    this.backCTX.restore();

    // Render the ball;
    this.backCTX.save();
    this.ball.render(this.backCTX, this.cellSize);
    this.backCTX.restore();

    // Render text at the bottum of the screen.
    this.backCTX.save();
    this.backCTX.fillStyle = "white";

    this.backCTX.font = "12px Arial";
    gameText = `Lives: ${this.ball.lives} - Score: ${this.score} - High Score: ${this.highScore}`;
    gameTextDim = this.backCTX.measureText(gameText);
    this.backCTX.fillText(gameText, (this.width / 2) * this.cellSize - gameTextDim.width / 2, (this.height + 1) * this.cellSize - 5);

    this.backCTX.font = "24px Arial";
    screenTextDim = this.backCTX.measureText(screenText);
    this.backCTX.fillText(screenText, (this.width / 2) * this.cellSize - screenTextDim.width / 2, (this.height / 2) * this.cellSize);
    this.backCTX.restore();

    // Copy the back buffer onto the screen buffer.
    this.screenCTX.drawImage(this.back, 0, 0);
  }

  /** @function loop
   * The game loop.
   */
  loop() {
    this.update();

    switch (this.state) {
      case "paused":
        this.render(`!Game Paused, Hit [P] To Unpause!`);
        break;
      case "running":
        this.render();
        break;
      case "next":
        clearInterval(this.loopID);
        this.reset(false);
        break;
      case "over":
        clearInterval(this.loopID);
        this.render(`!Game Over, Hit [P] To Restart!`);
        break;
      default:
        this.render(`!Unrecognized State!`);
        break;
    }
  }

  /** @function pause
   *  Pauses the game.
   */
  pause() {
    this.state = "paused";
    clearInterval(this.loopID);
    this.render(`!Game Paused, Hit [P] To Unpause!`);
  }

  /** @function unpause
   *  Unpauses the game.
   */
  unpause() {
    this.state = "running";
    this.loopID = setInterval(() => this.loop(), this.speed);
    this.render();
  }
}
