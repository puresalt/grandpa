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

/**
 *
 * @param {Object} KEY
 * @returns {Function}
 */
export default function(KEY) {
  const DEFAULT_STATE = {
    element: document,

    keys: [
      {input: KEY.LEFT, keyCode: 97},
      {input: KEY.RIGHT, keyCode: 100},
      {input: KEY.UP, keyCode: 119},
      {input: KEY.DOWN, keyCode: 115},
      {input: KEY.PUNCH, keyCode: 106},
      {input: KEY.KICK, keyCode: 107},
      {input: KEY.JUMP, keyCode: 32},
      {input: KEY.CROUCH, keyCode: 108},
      {input: KEY.MENU, keyCode: 13}
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
  return function keyboardInput(config, events, context) {
    const extendedConfig = _.defaults(config || {}, _.clone(DEFAULT_STATE));
    const invertedLookup = _generateInvertedLookup(extendedConfig.keys);
    const eventLookup = _generateEventLookup(events, invertedLookup);

    extendedConfig.element.addEventListener('keypress', (event) => {
      let found = eventLookup[event.keyCode];

      if (!found || !_triggerEvent(event, found, context)) {
        return;
      }

      if (event.preventDefault) {
        event.preventDefault();
      }
      event.cancelBubble = true;
      event.returnValue = false;
      return false;
    });
  };
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
    gathered[invertedLookup[item.input]].push(item.callback);
    return gathered;
  }, {});
}

/**
 * Trigger an event, which if we do we will return true so our keyboard method can short circuit the event.
 *
 * @param {Event} event
 * @param {Array} items
 * @param {StateMachine?} context
 */
function _triggerEvent(event, items, context) {
  return items.reduce((gathered, item) => {
    if (
      item.state
      && context
      && (
        item.state !== context.current
        || (_.isArray(item.state) && !_.indexOf(item.state, context.current))
      )
    ) {
      return gathered;
    }
    item.callback(event);
    return true;
  }, false);
}