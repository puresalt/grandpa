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

const _ = require('lodash');

/**
 *
 *
 * @TODO Transfer this to a datastore and add authentication on top of this.
 * @returns {{
 *   all(): Array,
 *   get(String): (Object|false),
 *   has(String): Boolean,
 *   remove(String, Array=): Boolean,
 *   save(String, Object): void, replace(String, Object): boolean
 * }}
 * @constructor
 */
const State = () => {
  const _data = {};

  const methods = {
    /**
     * Get all of the possible saved states.
     *
     * @returns {Array}
     */
    all() {
      return Object.keys(_data);
    },

    /**
     * Get our data if it exists.
     *
     * @param {String} id
     * @returns {Object|false}
     */
    get(id) {
      if (!this.has(_data[id])) {
        return false;
      }
      return _data[id];
    },

    /**
     * See if a state exists.
     *
     * @param {String} id
     * @returns {Boolean}
     */
    has(id) {
      return typeof _data[id] !== 'undefined';
    },

    /**
     * Remove a state.
     *
     * @param {String} id
     * @param {Array?} properties
     * @returns {Boolean}
     */
    remove(id, properties) {
      if (!_data[id]) {
        return false;
      } else if (!properties) {
        delete _data[id];
      } else {
        for (let i = 0, count = properties.length; i < count; i = i + 1) {
          delete _data[id][properties[i]];
        }
      }
      return true;
    },

    /**
     * Save our state.
     *
     * @param {String} id
     * @param {Object} data
     */
    save(id, data) {
      _data[id] = _.defaults(data, _data[id] || {});
      if (_data[id].id) {
        delete _data[id].id;
      }
    },

    /**
     * Replace a state object if it exists.
     *
     * @param {String} id
     * @param {Object} data
     */
    replace(id, data) {
      if (!this.has(_data[id])) {
        return false;
      }
      _data[id] = data;
      if (_data[id].id) {
        delete _data[id].id;
      }
      return true;
    }
  };
  Object.freeze(methods);

  return methods;
};

module.exports = State;
