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

/* globals document */

'use strict';

import _ from 'lodash/fp';
import KEY from './key';

const _defaultConfig = {
  element: document,

  keys: [
    {input: KEY.LEFT, keyCode: 65},
    {input: KEY.RIGHT, keyCode: 68},
    {input: KEY.UP, keyCode: 87},
    {input: KEY.DOWN, keyCode: 83},
    {input: KEY.PUNCH, keyCode: 74},
    {input: KEY.KICK, keyCode: 75},
    {input: KEY.JUMP, keyCode: 32},
    {input: KEY.CROUCH, keyCode: 16},
    {input: KEY.MENU, keyCode: 27},
    {input: KEY.DEBUG, keyCode: 112}
  ]
};

/**
 * Function to first map a configuration to our Input.KEY enum, and then to map that to an event lookup and attach it to
 * our element's event listener.
 *
 * @param {Object} config
 * @param {Object} inputState
 * @param {StateMachine?} context
 * @returns {{getConfig: Function}}
 */
export default function KeyboardInput(config, inputState, context) {
  const _extendedConfig = _.defaults(_defaultConfig, config || {});
  const _eventLookup = _generateEventLookup(_extendedConfig.keys);

  /**
   * Helper function to add our event listener on both up and down.
   *
   * @param {String} state
   * @returns {function(*=)}
   * @private
   */
  const _eventListener = (state) => {
    return (event) => {
      let found = _eventLookup[event.keyCode];
      if (!found || !inputState.triggerEvent(state, event, found, context)) {
        return;
      }
      if (event.preventDefault) {
        event.preventDefault();
      }
      event.cancelBubble = true;
      event.returnValue = false;
      return false;
    };
  };

  let _press = _eventListener('press');
  let _release = _eventListener('release');

  _extendedConfig.element.addEventListener('keydown', _press);
  _extendedConfig.element.addEventListener('keyup', _release);

  return {
    /**
     * Get the current config.
     *
     * @returns {*}
     */
    getConfig() {
      return _extendedConfig;
    },

    /**
     * Remove our event listeners in the case that we're going to switch input.
     */
    remove() {
      _extendedConfig.element.removeEventListener('kedown', _press);
      _extendedConfig.element.removeEventListener('keup', _release);
    }
  };
}

/**
 * Generate an event lookup.
 *
 * @param {Array} events
 * @returns {Object}
 */
function _generateEventLookup(events) {
  return events.reduce((gathered, item) => {
    gathered[item.keyCode] = item.input;
    return gathered;
  }, {});
}
