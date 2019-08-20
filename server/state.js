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
 * @TODO Transfer this to a datastore and add authentication on top of this.
 *
 * @returns {module:state} Access methods for state.
 * @module state
 */
const State = () => {
  const _data = {};

  /** @alias module:state */
  const methods = {
    /**
     * Get all of the possible saved states.
     *
     * @returns {Array} Get all stored ids.
     */
    all() {
      return Object.keys(_data);
    },

    /**
     * Get our data if it exists.
     *
     * @param {String} id Load data for a given `id`.
     * @returns {Object|null} Return data or `null`, if `null` is a possible type of valid data use in conjunction with
     *   the `state.has(id)` method.
     */
    get(id) {
      if (!this.has(id)) {
        return null;
      }
      return _data[id];
    },

    /**
     * See if a state exists.
     *
     * @param {String} id Check if `id` exists in our data store.
     * @returns {Boolean} `true` if it exists `false` if it doesn't.
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
     * @param {String} id Location to save our data to.
     * @param {Object} data Data to save.
     */
    save(id, data) {
      _data[id] = Object.assign({}, _data[id] || {}, data);
      if (_data[id].id) {
        delete _data[id].id;
      }
    },

    /**
     * Replace a state object if it exists.
     *
     * @param {String} id Replace data if it exists at this given location.
     * @param {Object} data Data to replace the old data with.
     */
    replace(id, data) {
      if (!this.has(id)) {
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
