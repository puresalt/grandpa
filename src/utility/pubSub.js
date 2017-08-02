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

  const events = {};

  return {

    /**
     * Subscribe an event.
     *
     * @param {String} event
     * @param {Function} callback
     * @returns {{unsubscribe: Function}}
     */
    subscribe: (event, callback) => {
      if (!events.hasOwnProperty(event)) {
        events[event] = [];
      }

      const id = events[event].push(callback) - 1;

      return {
        unsubscribe: () => {
          events[event].splice(id, 1);
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
      for (let key in events) {
        if (!events.hasOwnProperty(key)) {
          continue;
        }
        events[event] = events[event].filter(filter);
      }
    },

    /**
     * Trigger a given event if it exists.
     *
     * @param {String} event
     */
    publish: (event) => {
      if (!events.hasOwnProperty(event)) {
        return;
      }
      const args = Array.prototype.slice.call(arguments);
      args.shift();
      events[event].forEach(item => {
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
        delete events[event];
        return;
      }
      for (let key in events) {
        if (!events.hasOwnProperty(key)) {
          continue;
        }
        delete events[key];
      }
    }
  };
}
