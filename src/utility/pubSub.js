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

/**
 * Our PubSub object.
 *
 * @returns {{subscribe: (function(String, Function)), unsubscribe: (function(String, Function)), publish: (function(String)), clear: (function(String=))}}
 * @constructor
 */
export default function PubSub() {
  const _events = {};

  return {

    /**
     * Subscribe an event.
     *
     * @param {String} event
     * @param {Function} callback
     * @returns {{unsubscribe: Function}}
     */
    subscribe: (event, callback) => {
      if (!_events.hasOwnProperty(event)) {
        _events[event] = [];
      }

      const id = _events[event].push(callback) - 1;

      return {
        unsubscribe: () => {
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
    unsubscribe: (event, callback) => {
      const filter = item => {
        return item !== callback;
      };
      for (let key in _events) {
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
     */
    publish: (event) => {
      if (!_events.hasOwnProperty(event)) {
        return;
      }
      const args = Array.prototype.slice.call(arguments);
      args.shift();
      _events[event].forEach(item => {
        item.apply(this, args);
      });
    },

    /**
     * Remove ever a specific event or all if no event is provided.
     *
     * @param {String?} event
     */
    clear: (event) => {
      if (event) {
        delete _events[event];
        return;
      }
      for (let key in _events) {
        if (!_events.hasOwnProperty(key)) {
          continue;
        }
        delete _events[key];
      }
    }
  };
}
