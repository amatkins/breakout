/* template.js */

export default class Template {
  /** @constructor
   * Constructs a new instance of a brick template.
   * @param  {Boolean} [isBrick=true]   If it is a brick or a space.
   * @param  {Boolean} [canBreak=true]  If it can be broken.
   * @param  {Number}  [maxLife=1]      The max hits it can take.
   * @param  {Array}   [worth=[1]]      The list of values it gives at each health increment.
   * @param  {Array}   [colors=["red"]] The color of the brick at each health increment.
   */
  constructor(isBrick = true, canBreak = true, maxLife = 1, worth = [1], colors = ["red"]) {
    this.isBrick = isBrick;
    this.canBreak = canBreak;
    this.life = maxLife;
    this.worth = worth;
    this.colors = colors;

    this.cast = this.cast.bind(this);
  }

  /** @function cast
   * Creates a new object from the template.
   * @param  {Integer} newSize The size of the object.
   * @return {Object}          The new object from the template.
   */
  cast(newSize) {
    return  {
      size: newSize,
      isBrick: this.isBrick,
      canBreak: this.canBreak,
      life: this.life,
      worth: this.worth,
      colors: this.colors
    };
  }
}
