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

/** @module pubSub */

'use strict';

/**
 * Create a PubSub.
 *
 * @returns {{
 *   subscribe: Function,
 *   unsubscribe: Function,
 *   publish: Function,
 *   clear: Function
 * }}
 * @alias module:pubSub
 */
function PubSub() {
  const _events = {};

  const methods = {
    /**
     * Subscribe an event.
     *
     * @param {String} event
     * @param {Function} callback
     * @returns {{unsubscribe: Function}}
     */
    subscribe(event, callback) {
      if (!_events.hasOwnProperty(event)) {
        _events[event] = [];
      }
      const id = _events[event].push(callback) - 1;
      return {
        unsubscribe() {
          _events[event].splice(id, 1);
        }
      };
    },

    /**
     * Unsubscribe an event.
     *
     * @param {String} event
     * @param {Function} callback
     */
    unsubscribe(event, callback) {
      const filter = item => item !== callback;
      for (const key in _events) {
        /* istanbul ignore if */
        if (!_events.hasOwnProperty(key)) {
          continue;
        }
        _events[event] = _events[event].filter(filter);
      }
    },

    /**
     * Trigger a given event if it exists.
     *
     * @param {String} event
     * @param {...Array} args
     */
    publish(event, ...args) {
      if (!_events.hasOwnProperty(event)) {
        return;
      }
      _events[event].forEach(item => item.apply(this, args));
    },

    /**
     * Remove ever a specific event or all if no event is provided.
     *
     * @param {String=} event
     */
    clear(event) {
      if (event) {
        _events[event] = null;
        delete _events[event];
        return;
      }
      for (const key in _events) {
        /* istanbul ignore if */
        if (!_events.hasOwnProperty(key)) {
          continue;
        }
        _events[key] = null;
        delete _events[key];
      }
    }
  };

  Object.freeze(methods);

  return methods;
}

const singleton = PubSub();

export default {
  /**
   * Get a global singleton.
   *
   * @returns {{
   *   subscribe: Function,
   *   unsubscribe: Function,
   *   publish: Function,
   *   clear: Function
   * }}
   */
  singleton() {
    return singleton;
  },

  /**
   * Get a single instance.
   *
   * @returns {{
   *   subscribe: Function,
   *   unsubscribe: Function,
   *   publish: Function,
   *   clear: Function
   * }}
   */
  instance() {
    return PubSub();
  }
};
