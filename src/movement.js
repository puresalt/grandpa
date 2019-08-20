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

/** @module movement */

'use strict';

import DIRECTION from './movement/direction';
import ANGLE from './movement/direction/angle';
import GUIDED from './movement/guided';

/**
 * Resolve any direction issues and keep the state internal.
 *
 * @param {Object=} loadState Default state for our given movement object
 * @returns {module:movement} Our movement object
 * @alias module:movement
 */
function MovementFactory(loadState) {
  loadState = loadState || {};

  const _lastDirection = {
    direction: DIRECTION.RIGHT
  };
  _setLastDirection();

  /**
   * Set the last direction if defined.
   *
   * @param {String=} direction
   * @private
   * @ignore
   */
  function _setLastDirection(direction) {
    _lastDirection[DIRECTION.RIGHT] = 0;
    _lastDirection[DIRECTION.LEFT] = 0;
    _lastDirection[DIRECTION.UP] = 0;
    _lastDirection[DIRECTION.DOWN] = 0;
    if (direction) {
      _lastDirection[direction] = Date.now();
    }
  }

  return {
    direction: 0,
    guided: false,
    jumpHeight: 20,
    jumpSpeed: 50,
    crouching: false,
    facing: DIRECTION.RIGHT,
    kicking: false,
    punching: false,
    jumping: 0,
    moving: false,
    running: false,
    stunned: false,

    /**
     * Resolve a given direction and trigger movement logic.
     *
     * @param {Number} angle Angle of the direction we want to move with
     */
    move(angle) {
      this.moving = angle !== null;

      if (!this.moving) {
        this.running = false;
        return _setLastDirection(_lastDirection.direction);
      }

      this.direction = angle;
      if (this.direction <= ANGLE[DIRECTION.UP] && this.direction >= ANGLE[DIRECTION.DOWN]) {
        if (_lastDirection[DIRECTION.RIGHT] && (this.direction < ANGLE[DIRECTION.UP_RIGHT] && this.direction > ANGLE[DIRECTION.DOWN_RIGHT])) {
          this.running = this.running || Date.now() - _lastDirection[DIRECTION.RIGHT] < MovementFactory.TAP_RESPONSE_TIME;
        } else if (this.facing !== DIRECTION.RIGHT || this.direction >= ANGLE[DIRECTION.UP_RIGHT] || this.direction <= ANGLE[DIRECTION.DOWN_RIGHT]) {
          this.running = false;
        }
        this.facing = DIRECTION.RIGHT;
        _lastDirection.direction = DIRECTION.RIGHT;
      } else {
        if (_lastDirection[DIRECTION.LEFT] && (this.direction > ANGLE[DIRECTION.UP_LEFT] || this.direction < ANGLE[DIRECTION.DOWN_LEFT])) {
          this.running = this.running || Date.now() - _lastDirection[DIRECTION.LEFT] < MovementFactory.TAP_RESPONSE_TIME;
        } else if (this.facing !== DIRECTION.LEFT || (this.direction <= ANGLE[DIRECTION.UP_LEFT] && this.direction >= ANGLE[DIRECTION.DOWN_LEFT])) {
          this.running = false;
        }
        this.facing = DIRECTION.LEFT;
        _lastDirection.direction = DIRECTION.LEFT;
      }

      _setLastDirection();
    },

    /**
     * Start getting your crouch going.
     *
     * @param {Boolean} active Whether we are crouching or not
     */
    crouch(active) {
      this.crouching = active;
    },

    /**
     * Try and jump.
     *
     * @param {Boolean} active Whether we are jumping or not
     * @param {Boolean=} alreadyFired Whether we have already triggered a jump event
     */
    jump(active, alreadyFired) {
      if (!active || this.guided || alreadyFired) {
        return;
      }
      this.jumping = this.jumpSpeed;
      this.guided = GUIDED.JUMP;
    },

    /**
     * Kicking time.
     *
     * @param {Boolean} active Whether we are kicking or not
     */
    kick(active) {
      if (!active) {
        this.kicking = false;
      } else if (!this.punching && !this.kicking) {
        this.kicking = Date.now();
      }
    },

    /**
     * Throw the punch.
     *
     * @param {Boolean} active Whether we are punching or not
     */
    punch(active) {
      if (!active) {
        this.punching = false;
      } else if (!this.punching && !this.kicking) {
        this.punching = Date.now();
      }
    },

    /**
     * Reset our movement state.
     */
    reset() {
      _lastDirection.direction = DIRECTION.RIGHT;
      _setLastDirection();
      this.direction = 0;
      this.jumpHeight = 20;
      this.jumpSpeed = 50;
      this.crouching = false;
      this.facing = DIRECTION.RIGHT;
      this.kicking = false;
      this.punching = false;
      this.jumping = 0;
      this.moving = false;
      this.running = false;
      this.stunned = false;
      this.guided = false;
    },

    ...loadState
  };
}

MovementFactory.TAP_RESPONSE_TIME = 100;
Object.freeze(MovementFactory);

export default MovementFactory;
