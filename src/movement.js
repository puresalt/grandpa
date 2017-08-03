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

import KEY from './input/key';
import DIRECTION from './movement/direction';

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
     * @param {Object} pressed
     */
    direction(pressed) {
      if (pressed[KEY.UP].pressed && pressed[KEY.RIGHT].pressed) {
        this.running = false;
        this.moving = DIRECTION.UP_RIGHT;
        this.facing = DIRECTION.RIGHT;
      } else if (pressed[KEY.UP].pressed && pressed[KEY.LEFT].pressed) {
        this.running = false;
        this.moving = DIRECTION.UP_LEFT;
        this.facing = DIRECTION.LEFT;
      } else if (pressed[KEY.DOWN].pressed && pressed[KEY.RIGHT].pressed) {
        this.running = false;
        this.moving = DIRECTION.DOWN_RIGHT;
        this.facing = DIRECTION.RIGHT;
      } else if (pressed[KEY.DOWN].pressed && pressed[KEY.LEFT].pressed) {
        this.running = false;
        this.moving = DIRECTION.DOWN_LEFT;
        this.facing = DIRECTION.LEFT;
      } else if (pressed[KEY.RIGHT].pressed) {
        if (_lastRight) {
          this.running = Date.now() - _lastRight < 100;
          _lastRight = 0;
        }
        this.moving = DIRECTION.RIGHT;
        this.facing = DIRECTION.RIGHT;
      } else if (pressed[KEY.LEFT].pressed) {
        if (_lastLeft) {
          this.running = Date.now() - _lastLeft < 100;
          _lastLeft = 0;
        }
        this.moving = DIRECTION.LEFT;
        this.facing = DIRECTION.LEFT;
      } else if (pressed[KEY.UP].pressed) {
        this.running = false;
        this.moving = DIRECTION.UP;
      } else if (pressed[KEY.DOWN].pressed) {
        this.running = false;
        this.moving = DIRECTION.DOWN;
      } else {
        if (this.facing === DIRECTION.RIGHT) {
          _lastRight = Date.now();
          this.running = false;
        } else if (this.facing === DIRECTION.LEFT) {
          _lastLeft = Date.now();
          this.running = false;
        }
        this.moving = null;
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
     * @param {Boolean} active;
     */
    jump(active) {
      if (!active || this.jumping > 0) {
        return;
      }
      this.jumping = 30;
      switch (this.moving) {
        case DIRECTION.UP_LEFT:

          break;
      }
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
