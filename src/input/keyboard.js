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
    {input: KEY.MENU, keyCode: 27}
  ]
};

/**
 * Function to first map a configuration to our Input.KEY enum, and then to map that to an event lookup and attach it to
 * our element's event listener.
 *
 * @param {Object} config
 * @param {Array} events
 * @param {StateMachine?} context
 * @returns {Function}
 */
export default function KeyboardInput(config, events, context) {
  const _extendedConfig = _.defaults(_defaultConfig, config || {});
  const _invertedLookup = _generateInvertedLookup(_extendedConfig.keys);
  const _eventLookup = _generateEventLookup(events, _invertedLookup);

  const _eventListener = (state) => {
    return (event) => {
      let found = _eventLookup[event.keyCode];
      if (!found || !_triggerEvent(state, event, found, context)) {
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

  _extendedConfig.element.addEventListener('keyup', _eventListener('release'));
  _extendedConfig.element.addEventListener('keydown', _eventListener('press'));
}

/**
 * Generate a pre lookup flattening out our configured keys with their appropriate actions.
 *
 * @param {Array} keys
 * @returns {Object}
 */
function _generateInvertedLookup(keys) {
  return keys.reduce((gathered, item) => {
    gathered[item.input] = item.keyCode;
    return gathered;
  }, {});
}

/**
 * Generate an event lookup.
 *
 * @param {Array} events
 * @param {Object} invertedLookup
 * @returns {Object}
 * @throws {Error}
 */
function _generateEventLookup(events, invertedLookup) {
  return events.reduce((gathered, item) => {
    if (!invertedLookup[item.input]) {
      throw new Error('Missing input for: ' + item.input);
    }
    gathered[invertedLookup[item.input]] = gathered[invertedLookup[item.input]] || [];
    gathered[invertedLookup[item.input]].push(item);
    return gathered;
  }, {});
}

/**
 * Trigger an event, which if we do we will return true so our keyboard method can short circuit the event.
 *
 * @param {String} state
 * @param {Event} event
 * @param {Array} items
 * @param {StateMachine?} context
 */
function _triggerEvent(state, event, items, context) {
  return items.reduce((gathered, item) => {
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
    item.trigger(state, event);
    return true;
  }, false);
}
