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

import _ from 'lodash/fp';

const DEFAULT_POSITION = {
  x: 0,
  y: 0,
  height: 0,
  width: 0
};

export default class Sprite {

  /**
   * Create our sprite, set it's current state and go from there.
   *
   * @param {Object} state
   * @param {Object} defaultState
   */
  constructor(state, defaultState) {
    this._defaultState = defaultState || _.clone(DEFAULT_POSITION);
    this.setState(state);
  }

  /**
   * Set the current state of our object.
   *
   * @param {Object} state
   * @returns {Sprite}
   */
  setState(state) {
    this._state = _.defaults(state, this._defaultState);
    return this;
  }

  /**
   * Send the render command to our sprite to let it know it needs to update it's state.
   *
   * @param {Number} delta
   * @returns {Boolean}
   */
  render(delta) {
    throw new ReferenceError(this.constructor.name + ' is missing a `render` definition.');
  }
}
