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

import KEY from './key';

/**
 * Get our initial state.
 *
 * @returns {Object}
 */
function setInitial() {
  let keys = {};
  for (let key in KEY) {
    if (!KEY.hasOwnProperty(key)) {
      continue;
    }
    keys[key] = {pressed: false};
  }
  return keys;
}

/**
 * Handle our input state.
 *
 * @param {Object} movement
 * @param {{key: Object, movement: String}?} loadState
 * @returns {{getEvents: (function()), getKeys: (function()), getMovement: (function())}}
 */
export default function InputState(movement, loadState) {
  let _keys = loadState || setInitial();

  const _movementDirection = (key) => {
    return (direction) => {
      _keys[key].pressed = direction === 'press';
      movement.trigger.direction(_keys);
    };
  };

  const _toggleMovementAction = (key, action) => {
    return (direction) => {
      _keys[key].pressed = direction === 'press';
      action(_keys[key].pressed);
    };
  };

  const _events = [
    {
      input: KEY.LEFT,
      state: 'playing',
      trigger: _movementDirection(KEY.LEFT)
    },
    {
      input: KEY.RIGHT,
      state: 'playing',
      trigger: _movementDirection(KEY.RIGHT)
    },
    {
      input: KEY.UP,
      state: 'playing',
      trigger: _movementDirection(KEY.UP)
    },
    {
      input: KEY.DOWN,
      state: 'playing',
      trigger: _movementDirection(KEY.DOWN)
    },
    {
      input: KEY.PUNCH,
      state: 'playing',
      trigger: _toggleMovementAction(KEY.PUNCH, movement.trigger.punch)
    },
    {
      input: KEY.KICK,
      state: 'playing',
      trigger: _toggleMovementAction(KEY.KICK, movement.trigger.kick)
    },
    {
      input: KEY.JUMP,
      state: 'playing',
      trigger: movement.trigger.jump
    },
    {
      input: KEY.CROUCH,
      state: 'playing',
      trigger: _toggleMovementAction(KEY.CROUCH, movement.trigger.crouch)
    },
    {
      input: KEY.MENU,
      state: 'playing',
      trigger: () => {
        // do nothing.
      }
    }
  ];

  return {
    getEvents: () => {
      return _events;
    }
  };
}
