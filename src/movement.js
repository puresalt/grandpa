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

/* jshint maxcomplexity: 9, maxstatements: 17 */

'use strict';

import DIRECTION from './movement/direction';
import ANGLE from './movement/direction/angle';

/**
 * Resolve any direction issues and keep the state internal.
 *
 * @param {Object?} loadState
 * @returns {Object}
 * @constructor
 */
export default function InputMovement(loadState) {
  let _lastRight = 0;
  let _lastLeft = 0;
  return Object.assign(Object.create({
    jumpHeight: 30,
    crouching: false,
    facing: DIRECTION.RIGHT,
    kicking: false,
    punching: false,
    jumping: 0,
    moving: null,
    running: false,
    stunned: false,

    /**
     * Resolve a given direction and trigger movement logic.
     *
     * @param {Number} angle
     */
    direction(angle) {
      this.moving = angle;
      if (this.moving === null) {
        if (this.facing === DIRECTION.RIGHT) {
          _lastRight = Date.now();
          this.running = false;
        } else {
          _lastLeft = Date.now();
          this.running = false;
        }
      } else if (this.moving <= ANGLE[DIRECTION.UP] && this.moving >= ANGLE[DIRECTION.DOWN]) {
        if (this.facing !== DIRECTION.RIGHT) {
          this.running = false;
        }
        if (this.moving < ANGLE[DIRECTION.UP_RIGHT] && this.moving > ANGLE[DIRECTION.DOWN_RIGHT]) {
          if (_lastRight) {
            this.running = Date.now() - _lastRight < 100;
            _lastRight = 0;
          }
        }
        this.facing = DIRECTION.RIGHT;
      } else {
        if (this.facing !== DIRECTION.LEFT) {
          this.running = false;
        }
        if (this.moving > ANGLE[DIRECTION.UP_LEFT] || this.moving < ANGLE[DIRECTION.DOWN_RIGHT]) {
          if (_lastLeft) {
            this.running = Date.now() - _lastLeft < 100;
            _lastLeft = 0;
          }
        }
        this.facing = DIRECTION.LEFT;
      }
    },

    /**
     * Start getting your crouch going.
     *
     * @param {Boolean} active
     */
    crouch(active) {
      this.crouching = active;
    },

    /**
     * Try and jump.
     *
     * @param {Boolean} active
     * @param {Boolean} alreadyFired
     */
    jump(active, alreadyFired) {
      if (!active || this.jumping > 0 || alreadyFired) {
        return;
      }
      this.jumping = this.jumpHeight;
    },

    /**
     * Kicking time.
     *
     * @param {Boolean} active
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
     * @param {Boolean} active
     */
    punch(active) {
      if (!active) {
        this.punching = false;
      } else if (!this.punching && !this.kicking) {
        this.punching = Date.now();
      }
    }
  }), loadState || {});
}
