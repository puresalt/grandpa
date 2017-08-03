/**
 * NUMBER ONE GRANDPA
 *
 * LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@puresalt.gg so we can send you a copy immediately.
 *
 */

'use strict';

const MathUtility = {

  /**
   * Make sure a number is within a range.
   *
   * @param {Number} x
   * @param {Number} from
   * @param {Number} to
   * @returns {Boolean}
   */
  between: (x, from, to) => {
    return x && from <= x && x <= to;
  },

  /**
   * Decrement by a given number to cool down to.
   *
   * @param {Number} start
   * @param {Number?} decrement
   * @returns {Number}
   */
  coolDown: (start, decrement) => {
    return start
      ? Math.max(0, start - (decrement || 1))
      : 0;
  },

  /**
   * Get x if it's between minimum and maximum, otherwise the minimum or maximum depending on which side of the bounds.
   *
   * @param {Number} x
   * @param {Number} minimum
   * @param {Number} maximum
   * @returns {Number}
   */
  minMax: (x, minimum, maximum) => {
    return Math.max(minimum, Math.min(maximum, x));
  },

  /**
   * Compare two sets against each other.
   *
   * @param {{h: Number, w: Number, x: Number, y: Number}} dimensions1
   * @param {{h: Number, w: Number, x: Number, y: Number}} dimensions2
   * @returns {Boolean}
   */
  overlap: (dimensions1, dimensions2) => {
    return !(
      (dimensions1.x + dimensions1.w - 1) < dimensions2.x
      || (dimensions2.x + dimensions2.w - 1) < dimensions1.x
      || (dimensions1.y + dimensions1.h - 1) < dimensions2.y
      || (dimensions2.y + dimensions2.h - 1) < dimensions1.y
    );
  },

  /**
   * Return a random floating point number.
   *
   * @param {Number} minimum
   * @param {Number} maximum
   * @returns {Number}
   */
  random: (minimum, maximum) => {
    return (minimum + (Math.random() * (maximum - minimum)));
  },

  /**
   * Return a random choice from a given array.
   *
   * @param {Array} choices
   * @returns {*}
   */
  randomChoice: (choices) => {
    return choices[MathUtility.randomNumber(0, choices.length - 1)];
  },

  /**
   * Return a randomly selected Boolean.
   *
   * @returns {Boolean}
   */
  randomBoolean: () => {
    return MathUtility.randomChoice([true, false]);
  },

  /**
   * Return a random whole number.
   *
   * @param {Number} minimum
   * @param {Number} maximum
   * @returns {Number}
   */
  randomNumber: (minimum, maximum) => {
    return Math.round(MathUtility.random(minimum, maximum));
  }
};

export default MathUtility;
