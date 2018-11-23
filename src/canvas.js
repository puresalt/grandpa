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
import SpriteFactory from './sprite/factory';

/**
 * And a callback when an element successfully loads.
 *
 * @param {HTMLElement} element
 * @param {function(HTMLElement)} callback
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
 * @param {function()?} callback
 * @returns {HTMLElement}
 */
function createImageElementForTileset(tileset, callback) {
  const element = document.createElement('img');
  element.src = tileset.src;
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
  const _alive = [];
  let _runtime = 0;

  const _renderEntity = entity => entity.render(_element, _tilesets[entity.tileset.src], _runtime);

  const methods = {
    /**
     * Render our canvas.
     */
    render(runtime) {
      _runtime = runtime;
      _element.clearRect(0, 0, SIZER.width, SIZER.height);
      _alive.sort(SpriteFactory.sort).forEach(_renderEntity);
    },

    /**
     * Add an entity to be drawn.
     *
     * @param {Object} entity
     */
    addEntity(entity) {
      console.log('ADDING:', entity.name);
      _alive.push(entity);
    },

    /**
     * Remove a specific entity.
     *
     * @param {Object} entity
     */
    removeEntity(entity) {
      for (let i = 0, count = _alive.length; i < count; ++i) {
        if (_alive[i] !== entity) {
          continue;
        }
        console.log('REMOVING:', entity.name);
        _alive.splice(i, 1);
      }
    },

    /**
     * Define the tilesets to use for a given level. Trigger `callback` when all images are loaded.
     *
     * @param {Array} tilesets
     * @param {function()} callback
     */
    loadTilesets(tilesets, callback) {
      const waitingFor = tilesets.length;
      let loaded = 0;
      tilesets.forEach((tileset) => {
        createImageElementForTileset(tileset, (element) => {
          _tilesets[tileset.src] = {
            image: element,
            height: element.height,
            width: element.width
          };
          if (++loaded === waitingFor) {
            callback();
          }
        });
      });
    }
  };
  Object.freeze(methods);

  return methods;
}
