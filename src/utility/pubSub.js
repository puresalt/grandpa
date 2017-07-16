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

export default function PubSub() {

  let events = {};

  return {
    subscribe: (event, listener) => {
      if (!events.hasOwnProperty(event)) {
        events[event] = [];
      }

      let id = events[event].push(listener) - 1;

      return {
        unsubscribe: () => {
          events[event].splice(id, 1);
        }
      };
    },

    unsubscribe: (event, callback) => {
      let filter = item => {
        return item !== callback;
      };
      for (let key in events) {
        if (!events.hasOwnProperty(key)) {
          continue;
        }
        events[event] = events[event].filter(filter);
      }
    },

    publish: (event) => {
      if (!events.hasOwnProperty(event)) {
        return;
      }

      let args = Array.prototype.slice.call(arguments);
      args.shift();
      events[event].forEach(item => {
        item.apply(this, args);
      });
    },

    clear: (event) => {
      if (event) {
        delete events[event];
        return;
      }
      events = {};
    }
  };
}
