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
  let element = document.createElement('image');
  element.src = tileset.src;
  element.id = 'tileset-' + tileset.id;
  elementLoader(element, callback);
  return element;
}

export default function canvasFunction(canvas) {
  const _element = canvas.getContext('2d');
  let _tilesets = {};
  let _entities = [];

  const methods = {
    draw: () => {
      _entities.forEach(entity => {
        const state = entity.getState();
        const tileset = _tilesets[state.tileset.id];
        _element.drawImage(
          tileset.image,
          state.tileset.x,
          state.tileset.y,
          tileset.x,
          tileset.y,
          state.x,
          state.y,
          tileset.x,
          tileset.y
        );
      });
    },

    addEntity: (entity) => {
      _entities.push(entity);
      return methods;
    },

    setEntities: (entities) => {
      _entities = entities;
      return methods;
    },

    removeEntity: (entity) => {
      _entities = _entities.filter(item => {
        return item.id !== entity.id;
      });
      return methods;
    },

    clearEntities: () => {
      _entities = [];
      return methods;
    },

    setTilesets: (tilesets, ready) => {
      const waitingFor = tilesets.length;
      let replied = false;
      _tilesets = {};
      tilesets.forEach(tileset => {
        createImageElementForTileset(tileset, (element) => {
          _tilesets[tileset.id] = tileset;
          _tilesets[tileset.image] = element;
          if (!replied && _tilesets.length >= waitingFor) {
            replied = true;
            ready();
          }
        });
      });
      return methods;
    },

    clearTilesets: () => {
      _tilesets = {};
      return methods;
    }
  };

  return methods;
}
