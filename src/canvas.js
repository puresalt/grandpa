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

import SIZER from './sizer';

/**
 * And a callback when an element successfully loads.
 *
 * @param {HTMLElement} element
 * @param {Function} callback
 */
function elementLoader(element, callback) {
  let loaded = false;
  element.onload = element.onreadystatechange = function() {
    if (!loaded && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
      loaded = true;
      element.onload = element.onreadystatechange = null;
      callback(element);
    }
  };
}

/**
 * Create an image from a given tileset config.
 *
 * @param {Object} tileset
 * @param {Function?} callback
 * @returns {HTMLImageElement}
 */
function createImageElementForTileset(tileset, callback) {
  let element = document.createElement('img');
  element.src = tileset.src;
  element.id = 'tileset-' + tileset.id;
  elementLoader(element, callback);
  return element;
}

/**
 * Delegate our canvas rendering.
 *
 * @param {HTMLElement} element
 * @returns {Object}
 */
export default function canvasFunction(element) {
  const _element = element.getContext('2d');
  const _tilesets = {};
  let _entities = [];

  const methods = {
    /**
     * Render our canvas.
     *
     * @param {Number} fps
     */
    render() {
      _element.clearRect(0, 0, SIZER.width, SIZER.height);
      _entities.sort(_sortByY).forEach(entity => {
        entity.render(_element, _tilesets[entity.tileset.id]);
      });
    },

    /**
     * Add an entity to be drawn.
     *
     * @param {Object} entity
     * @returns {Object}
     */
    addEntity(entity) {
      _entities.push(entity);
      return methods;
    },

    /**
     * Set all of the entities for our canvas.
     *
     * @param {Array} entities
     * @returns {Object}
     */
    setEntities(entities) {
      methods.clearEntities();
      for (let i = 0, count = entities.length; i < count; ++i) {
        _entities.push(entities[i]);
      }
      return methods;
    },

    /**
     * Remove a specific entity.
     *
     * @param {Object} entity
     * @returns {Object}
     */
    removeEntity(entity) {
      _entities = _entities.filter(item => {
        return item.id !== entity.id;
      });
      return methods;
    },

    /**
     * Clear all of the defined entities.
     *
     * @returns {Object}
     */
    clearEntities() {
      for (let i = 0, count = _entities.length; i < count; ++i) {
        _entities[i] = null;
      }
      _entities.length = 0;
      return methods;
    },

    /**
     * Define the tilesets to use for a given level. Trigger `callback` when all images are loaded.
     *
     * @param {Array} tilesets
     * @param {Function} callback
     * @returns {Object}
     */
    setTilesets(tilesets, callback) {
      methods.clearTilesets();
      const waitingFor = tilesets.length;
      let replied = false;
      tilesets.forEach(tileset => {
        createImageElementForTileset(tileset, element => {
          _tilesets[tileset.id] = {
            image: element,
            height: element.height,
            width: element.width
          };
          if (!replied && Object.keys(_tilesets).length >= waitingFor) {
            replied = true;
            callback();
          }
        });
      });
      return methods;
    },

    /**
     * Clear all of the current tiles.
     *
     * @returns {Object}
     */
    clearTilesets() {
      for (let key in _tilesets) {
        if (!_tilesets.hasOwnProperty(key)) {
          continue;
        }
        _tilesets[key] = null;
        delete _tilesets[key];
      }
      return methods;
    }
  };

  return Object.freeze(methods);
}

/**
 * Sort two entities by their y and then x coordinates.
 *
 * @param {{x: Number, y: Number}} entity1
 * @param {{x: Number, y: Number}} entity2
 * @returns {Boolean}
 * @private
 */
function _sortByY(entity1, entity2) {
  return entity1.x > entity2.x || (entity1.x === entity2.x && entity1.y > entity2.y);
}
