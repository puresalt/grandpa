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

/* jshint maxcomplexity: 9 */

'use strict';

import _ from 'lodash/fp';
import DIRECTION from '../movement/direction';
import EVENT from '../event';
import KEY from './key';
import ANGLE from '../movement/direction/angle';
import debug from '../debug';

/**
 * Get our initial state.
 *
 * @returns {Object}
 */
function setInitial() {
  const keys = {};
  for (let key in KEY) {
    if (!KEY.hasOwnProperty(key)) {
      continue;
    }
    keys[key] = false;
  }
  return keys;
}

/**
 * Handle our input state.
 *
 * @param {Object} movement
 * @param {{key: Object, movement: String}?} loadState
 * @returns {{getKeys: (function()), triggerEvent: (function())}}
 */
export default function InputState(movement, loadState) {
  const _keys = loadState || setInitial();

  /**
   * Hold a directional action based on key presses.
   *
   * @param key
   * @returns {function(*)}
   * @private
   */
  const _holdDirectionalAction = (key) => {
    return (direction) => {
      _keys[key] = direction === EVENT.PRESS;

      let angle = null;
      if (_keys[KEY.RIGHT] && _keys[KEY.UP]) {
        angle = ANGLE[DIRECTION.UP_RIGHT];
      } else if (_keys[KEY.RIGHT] && _keys[KEY.DOWN]) {
        angle = ANGLE[DIRECTION.DOWN_RIGHT];
      } else if (_keys[KEY.LEFT] && _keys[KEY.UP]) {
        angle = ANGLE[DIRECTION.UP_LEFT];
      } else if (_keys[KEY.LEFT] && _keys[KEY.DOWN]) {
        angle = ANGLE[DIRECTION.DOWN_LEFT];
      } else if (_keys[KEY.RIGHT]) {
        angle = ANGLE[DIRECTION.RIGHT];
      } else if (_keys[KEY.LEFT]) {
        angle = ANGLE[DIRECTION.LEFT];
      } else if (_keys[KEY.UP]) {
        angle = ANGLE[DIRECTION.UP];
      } else if (_keys[KEY.DOWN]) {
        angle = ANGLE[DIRECTION.DOWN];
      }

      movement.move(angle);
    };
  };

  /**
   * Send a regular call to a movement action with true/false being passed along.
   *
   * @param {String} key
   * @param {String} action
   * @returns {function(*)}
   * @private
   */
  const _triggerDirectionalAction = (key, action) => {
    return (direction) => {
      const alreadyFired = _keys[key];
      _keys[key] = direction === EVENT.PRESS;
      movement[action](_keys[key], alreadyFired);
    };
  };

  const _events = [
    {
      input: KEY.DIRECTIONAL,
      state: 'playing',
      trigger: (direction, angle) => {
        movement.move(direction === EVENT.PRESS ? angle : null);
      }
    },
    {
      input: KEY.RIGHT,
      state: 'playing',
      trigger: _holdDirectionalAction(KEY.RIGHT)
    },
    {
      input: KEY.LEFT,
      state: 'playing',
      trigger: _holdDirectionalAction(KEY.LEFT)
    },
    {
      input: KEY.UP,
      state: 'playing',
      trigger: _holdDirectionalAction(KEY.UP)
    },
    {
      input: KEY.DOWN,
      state: 'playing',
      trigger: _holdDirectionalAction(KEY.DOWN)
    },
    {
      input: KEY.PUNCH,
      state: 'playing',
      trigger: _triggerDirectionalAction(KEY.PUNCH, 'punch')
    },
    {
      input: KEY.KICK,
      state: 'playing',
      trigger: _triggerDirectionalAction(KEY.KICK, 'kick')
    },
    {
      input: KEY.JUMP,
      state: 'playing',
      trigger: _triggerDirectionalAction(KEY.JUMP, 'jump')
    },
    {
      input: KEY.CROUCH,
      state: 'playing',
      trigger: _triggerDirectionalAction(KEY.CROUCH, 'crouch')
    },
    {
      input: KEY.MENU,
      state: 'playing',
      trigger: () => {
        // do nothing.
      }
    },
    {
      input: KEY.DEBUG,
      trigger: (direction) => {
        debug.toggle(direction === EVENT.PRESS);
      }
    }
  ];

  const _eventLookup = _generateEventLookup(_events);

  return {
    /**
     * Get defined keys.
     *
     * @returns {Object}
     */
    getKeys() {
      return _keys;
    },

    /**
     * Trigger an event, which if we do we will return true so our keyboard method can short circuit the event.
     *
     * @param {String} direction
     * @param {String} key
     * @param {StateMachine?} context
     * @param {Array} args
     */
    triggerEvent(direction, key, context, ...args) {
      if (!_eventLookup[key]) {
        return false;
      }
      return _eventLookup[key].reduce((gathered, item) => {
        if (
          item.state
          && context
          && (
            item.state !== context.state
            || (_.isArray(item.state) && !_.indexOf(item.state, context.state))
          )
        ) {
          return gathered;
        }
        item.trigger.apply(this, [direction].concat(args));
        return true;
      }, false);
    }
  };
}

/**
 * Create our eventLookup matching keys to events.
 *
 * @param {Array} events
 * @private
 */
function _generateEventLookup(events) {
  return events.reduce((gathered, event) => {
    gathered[event.input] = gathered[event.input] || [];
    gathered[event.input].push(event);
    return gathered;
  }, {});
}
