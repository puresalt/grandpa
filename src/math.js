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

const TO_DEGREES = (1 / Math.PI) * 180;
const TRUE_OR_FALSE = [true, false];

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
    return MathUtility.randomChoice(TRUE_OR_FALSE);
  },

  /**
   * Return a random whole number.
   *
   * @param {Number} minimum
   * @param {Number} maximum
   * @returns {Number}
   */
  randomNumber: (minimum, maximum) => {
    return MathUtility.round(MathUtility.random(minimum, maximum));
  },

  /**
   * Get the degree of a point referencing centerX and centerY.
   *
   * @param {Number} pointX
   * @param {Number} pointY
   * @param {Number?} centerX
   * @param {Number?} centerY
   * @returns {Number}
   */
  getDegreeOfPoints(pointX, pointY, centerX, centerY) {
    centerX = centerX || 0;
    centerY = centerY || 0;
    return Math.atan2(pointY - centerY, pointX - centerX) * TO_DEGREES;
  },

  /**
   * Get a point along an ellipse.
   *
   * @param {{x: Number, y: Number}} origin
   * @param {{angle: Number, height: Number, width: Number}} ellipse
   * @param {{x: Number, y: Number}} reusedObject
   * @returns {{x: Number, y: Number}}
   * @private
   */
  setPointOnEllipse(origin, ellipse, reusedObject) {
    reusedObject.x = origin.x - (ellipse.height * Math.sin(ellipse.angle)) * Math.sin(0) + (ellipse.width * Math.cos(ellipse.angle)) * Math.cos(0);
    reusedObject.y = origin.y + (ellipse.width * Math.cos(ellipse.angle)) * Math.sin(0) + (ellipse.height * Math.sin(ellipse.angle)) * Math.cos(0);
  },

  /**
   * Get a specific point along a quadratic curve.
   *
   * @param {Number}  origin
   * @param {Number} control
   * @param {Number} destination
   * @param {Number} position
   * @returns {Number}
   */
  getPointOnQuadraticCurve(origin, control, destination, position) {
    const T = 1 - position;
    return ((origin - (2 * control) + destination) * (T * T)) + (((2 * control) - (2 * origin)) * T) + origin;
  },

  /**
   * Return a rounded number.
   *
   * @param {Number} number
   * @returns {Number}
   */
  round(number) {
    return (number + 0.5) | 0;
  }
};

Object.freeze(MathUtility);

export default MathUtility;
