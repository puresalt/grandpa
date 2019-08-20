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

/** @module math */

'use strict';

const TO_DEGREES = (1 / Math.PI) * 180;
const JUMP_PEAK_REFERENCE = 0.55;
const DEGREES_PER_SLICE = 45;
const TRUE_OR_FALSE = [true, false];
Object.freeze(TRUE_OR_FALSE);

/**
 * Utility helper for all of our math based methods.
 *
 * @alias module:math
 */
const MathUtility = {
  /**
   * Make sure a number is within a range.
   *
   * @param {Number} x Number to check
   * @param {Number} from Minimum to check against
   * @param {Number} to Maximum to check against
   * @returns {Boolean} Whether `x` is between `from` and `to`.
   */
  between(x, from, to) {
    return x && x >= from && x <= to;
  },

  /**
   * Decrement by a given number to cool down to.
   *
   * @param {Number} start Start time of our cool down
   * @param {Number=} decrement How much we have cooled off since last trigger
   * @returns {Number} How much time is left before our cool down is complete
   */
  coolDown(start, decrement) {
    return start
      ? Math.max(0, start - (decrement || 1))
      : 0;
  },

  /**
   * Get x if it's between minimum and maximum, otherwise the minimum or maximum depending on which side of the bounds.
   *
   * @param {Number} number Number we want to find within a given bounds
   * @param {Number} minimum The lower bounds of our number
   * @param {Number} maximum The upper bounds of our number
   * @returns {Number}
   */
  minMax(number, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, number));
  },

  /**
   * Compare two sets against each other.
   *
   * @param {{h: Number, w: Number, x: Number, y: Number}} dimensions1 Dimension to compare against
   * @param {{h: Number, w: Number, x: Number, y: Number}} dimensions2 Dimension to compare with
   * @returns {Boolean} Whether they overlap or not
   */
  overlap(dimensions1, dimensions2) {
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
   * @param {Number} minimum Minimum range for our random number
   * @param {Number} maximum Maximum range for our random number
   * @returns {Number} Hopefully it is random and not always `4`
   */
  random(minimum, maximum) {
    return (minimum + (Math.random() * (maximum - minimum)));
  },

  /**
   * Return a random choice from a given array.
   *
   * @param {Array} choices Choices to randomly choose from
   * @returns {*} A random singular choice from `choices`
   */
  randomChoice(choices) {
    return choices[MathUtility.randomNumber(0, choices.length - 1)];
  },

  /**
   * Return a randomly selected Boolean.
   *
   * @returns {Boolean} Randomly returns true or false
   */
  randomBoolean() {
    return MathUtility.randomChoice(TRUE_OR_FALSE);
  },

  /**
   * Return a random whole number.
   *
   * @param {Number} minimum Minimum range for our random number
   * @param {Number} maximum Maximum range for our random number
   * @returns {Number} Hopefully it is random and not always `4`
   */
  randomNumber(minimum, maximum) {
    return MathUtility.round(MathUtility.random(minimum, maximum));
  },

  /**
   * Get the degree of a point referencing centerX and centerY.
   *
   * @param {Number} pointX X coordinate for our point
   * @param {Number} pointY Y coordinate for our point
   * @param {Number=} centerX X coordinate for the center
   * @param {Number=} centerY Y coordinate for the center
   * @returns {Number} Degree from the given coordinates
   */
  getDegreeOfPoints(pointX, pointY, centerX, centerY) {
    return Math.atan2(pointY - centerY, pointX - centerX) * TO_DEGREES;
  },

  /**
   * Get a point along an ellipse.
   *
   * @param {Number} origin Origin coordinates
   * @param {{angle: Number, height: Number, width: Number}} ellipse Ellipse we're moving along
   * @param {{x: Number, y: Number}} reusedObject Garbage Collection friendly object for storing our coordinates
   * @returns {{x: Number, y: Number}} Current coordinates along our ellipse
   */
  setPointOnEllipse(origin, ellipse, reusedObject) {
    reusedObject.x = origin.x
      - (ellipse.height * Math.sin(ellipse.angle)) * Math.sin(0)
      + (ellipse.width * Math.cos(ellipse.angle)) * Math.cos(0);
    reusedObject.y = origin.y
      + (ellipse.width * Math.cos(ellipse.angle)) * Math.sin(0)
      + (ellipse.height * Math.sin(ellipse.angle)) * Math.cos(0);
  },

  /**
   * Get a specific point along a quadratic curve.
   *
   * @param {Number} origin Origin coordinates
   * @param {Number} control Control point to curve our line around
   * @param {Number} destination Where our curvature will end
   * @param {Number} position Position along the route
   * @returns {Number} Coordinates from the given `position`
   */
  getPointOnQuadraticCurve(origin, control, destination, position) {
    const T = 1 - position;
    return ((origin - (2 * control) + destination) * (T * T)) + (((2 * control) - (2 * origin)) * T) + origin;
  },

  /**
   * Return a rounded number.
   *
   * @param {Number} number Number to round
   * @returns {Number} Quickly rounded number via bitwise
   */
  round(number) {
    return (number + 0.5) | 0;
  },

  /**
   * Return a rate to apply to a given speed as a way to control
   *
   * @param {Number} moving Direction we are moving
   * @param {Number} angle Angle of our movement
   * @param {Number=} degreesPerSlice Slices of a pie
   * @returns {Number} Tapered rate of moving diagonally
   */
  getTaperedRunningRate(moving, angle, degreesPerSlice) {
    degreesPerSlice = degreesPerSlice || DEGREES_PER_SLICE;
    return (moving - angle) / degreesPerSlice;
  },

  /**
   * Calculate the control point for our curve.
   *
   * @param {Number} origin Origin coordinates
   * @param {Number} peak Peak coordinates
   * @param {Number} destination Destinatin coordinates
   * @param {Number=} peakReference Reference we are running against
   * @returns {Number}
   */
  getQuadraticCurveControlPoint(origin, peak, destination, peakReference) {
    peakReference = peakReference || JUMP_PEAK_REFERENCE;
    return (peak / (2 * peakReference * (1 - peakReference)))
      - (origin * peakReference / (2 * (1 - peakReference)))
      - (destination * (1 - peakReference) / (2 * peakReference));
  }
};
Object.freeze(MathUtility);

export default MathUtility;
