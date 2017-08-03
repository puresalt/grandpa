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

import _ from 'lodash/fp';
import KEY from './input/key';
import DIRECTION from './movement/direction';

const DEFAULT_STATE = {
  crouching: false,
  facing: DIRECTION.RIGHT,
  kicking: false,
  punching: false,
  jumping: 0,
  moving: null,
  running: false
};

/**
 * Resolve any direction issues and keep the state internal.
 *
 * @param {Object?} loadState
 * @returns {Object}
 * @constructor
 */
export default function InputMovement(loadState) {
  const _movement = _.defaults(_.clone(DEFAULT_STATE), loadState);

  _movement.trigger = {
    direction: (pressed) => {
      if (pressed[KEY.UP].pressed && pressed[KEY.RIGHT].pressed) {
        _movement.moving = DIRECTION.UP_RIGHT;
        _movement.facing = DIRECTION.RIGHT;
      } else if (pressed[KEY.UP].pressed && pressed[KEY.LEFT].pressed) {
        _movement.moving = DIRECTION.UP_LEFT;
        _movement.facing = DIRECTION.LEFT;
      } else if (pressed[KEY.DOWN].pressed && pressed[KEY.RIGHT].pressed) {
        _movement.moving = DIRECTION.DOWN_RIGHT;
        _movement.facing = DIRECTION.RIGHT;
      } else if (pressed[KEY.DOWN].pressed && pressed[KEY.LEFT].pressed) {
        _movement.moving = DIRECTION.DOWN_LEFT;
        _movement.facing = DIRECTION.LEFT;
      } else if (pressed[KEY.RIGHT].pressed) {
        _movement.moving = DIRECTION.RIGHT;
        _movement.facing = DIRECTION.RIGHT;
      } else if (pressed[KEY.LEFT].pressed) {
        _movement.moving = DIRECTION.LEFT;
        _movement.facing = DIRECTION.LEFT;
      } else if (pressed[KEY.UP].pressed) {
        _movement.moving = DIRECTION.UP;
      } else if (pressed[KEY.DOWN].pressed) {
        _movement.moving = DIRECTION.DOWN;
      } else {
        _movement.moving = null;
      }
    },
    crouch: (active) => {
      _movement.crouching = active;
    },
    jump: () => {
      if (_movement.jumping) {
        return;
      }
      _movement.jumping = 240;
      switch (_movement.moving) {
        case DIRECTION.UP_LEFT:

          break;
      }
    },
    kick: (active) => {
      if (active) {
        if (!_movement.punching && !_movement.kicking) {
          _movement.kicking = Date.now();
        }
      }
    },
    punch: (active) => {
      if (!active) {
        _movement.punching = false;
      } else {
        if (!_movement.punching) {
          _movement.punching = Date.now();
        }
      }
    },
    lastPunch: () => {
      return _movement.punching;
    }
  };

  return _movement;
}
