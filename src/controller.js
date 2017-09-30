import Brick from './brick';
import Paddle from './paddle';
import Ball from './ball';

export default class Controller {
  /** @constructor
   * Creates a new game controller for a clone of Atari Breakout.
   * @param  {Array} layout A 2D layout of the board to play.
   *                        Each brick is represented by {size, canBreak}.
   */
  constructor(layout) {
    // Basic attributes of the controller.
    this.breakables = 0;
    this.bricks = [];
    this.cellSize = 35;
    this.height = 0;
    this.layout = layout;
    this.speed = 150;
    this.state = "paused",
    this.width = 0;

    // Initial setup of board.
    this.setup();
    this.paddle = new Paddle((this.width * this.cellSize) / 2 - this.cellSize, 2, 0);
    this.ball = new Ball((this.width * this.cellSize) / 2, (this.height - 0.5) * this.cellSize, 0, 1);

    // The display part of the buffer.
    this.screen = document.createElement("canvas");
    this.screen.width = this.width * this.cellSize;
    this.screen.height = this.height * this.cellSize + 43;
    document.body.appendChild(this.screen);
    this.screenCTX = this.screen.getContext("2d");

    // The back part of the buffer.
    this.back = document.createElement("canvas");
    this.back.width = this.width * this.cellSize;
    this.back.height = this.height * this.cellSize + 43;
    this.backCTX = this.back.getContext("2d");
    this.backCTX.font = "12px Arial";

    // Bind the methods to this class.
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.setup = this.setup.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.loop = this.loop.bind(this);

    // Bind the appropriate methods to their event listeners.
    window.onkeydown = this.handleKeyDownkeydown;

    // First rendering of game.
    this.render(`!Game Paused! !Hit [P] To Unpause!`);
  }

  handleKeyDown(event) {
    event.preventDefault();
  }

  setup() {
    var lastRow, lastBrick, nextLoc, width, maxWidth;

    this.bricks = [];
    this.breakables = 0;
    maxWidth = 0;

    this.layout.forEach((row) => {
      this.bricks.push([]);

      row.bricks.forEach((template) => {
        lastRow = this.bricks.length - 1;
        lastBrick = this.bricks[lastRow].length - 1;

        if (lastBrick > -1)
          nextLoc = this.bricks[lastRow][lastBrick].loc.x + this.bricks[lastRow][lastBrick].size;
        else
          nextLoc = 0;

        this.bricks[lastRow].push(new Brick(nextLoc, lastRow, template.size, template.canBreak, row.life, row.colors));

        if (!template.canBreak)
          this.breakables++;

        width = nextLoc + template.size;
        if (width > maxWidth)
          maxWidth = width;
      });
    });

    this.width = maxWidth;
    this.height = this.layout.length + 3;
  }

  update() {

  }

  render(screenText = ``, debugText = ``) {
    var gameText, gameTextDim, debugTextDim, screenTextDim;

    // fill screen
    this.backCTX.save();
    this.backCTX.fillStyle = "black";
    this.backCTX.fillRect(0, 0,
      this.width * this.cellSize,
      this.width * this.cellSize + 43);
    this.backCTX.restore();

    // Render the bricks
    this.bricks.forEach((row) => {
      row.forEach((brick) => {
        this.backCTX.save();
        brick.render(this.backCTX, this.cellSize);
        this.backCTX.restore();
      });
    });

    // Render the paddle
    this.backCTX.save();
    this.paddle.render(this.backCTX, this.width, this.height, this.cellSize);
    this.backCTX.restore();

    // Render the ball;
    this.backCTX.save();
    this.ball.render(this.backCTX, this.cellSize);
    this.backCTX.restore();

    // Get text rendering information.
    gameText = ``;
    gameTextDim = this.backCTX.measureText(gameText);
    debugTextDim = this.backCTX.measureText(debugText);
    screenTextDim = this.backCTX.measureText(screenText);

    // Render text at the bottum of the screen.
    this.backCTX.fillStyle = "white";
    this.backCTX.fillText(gameText, (this.width / 2) * this.cellSize - gameTextDim.width / 2, (this.height + 1) * this.cellSize + 5);
    this.backCTX.fillText(debugText, (this.width / 2) * this.cellSize - debugTextDim.width / 2, (this.height + 1) * this.cellSize + 20);
    this.backCTX.fillText(screenText, (this.width / 2) * this.cellSize - screenTextDim.width / 2, (this.height / 2) * this.cellSize);

    // Copy the back buffer onto the screen buffer.
    this.screenCTX.drawImage(this.back, 0, 0);
  }

  loop() {
    this.update();

    switch (this.state) {
      case "paused":
        this.render(`!Game Paused! !Hit [P] To Unpause!`);
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
    this.render(`!Game Paused! !Hit [P] To Unpause!`);
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
