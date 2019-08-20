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

/**
 * Keep track of all of our entities and delegate rendering accordingly.
 *
 * @module canvas
 */

'use strict';

import SIZER from './sizer';
import SpriteFactory from './sprite/factory';

/**
 * And a callback when an element successfully loads.
 *
 * @param {HTMLElement} element
 * @param {function(HTMLElement)} callback
 * @private
 * @ignore
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
 * @param {function()=} callback
 * @returns {HTMLElement}
 * @private
 * @ignore
 */
function createImageElementForTileset(tileset, callback) {
  const element = document.createElement('img');
  element.src = tileset.src;
  elementLoader(element, callback);
  return element;
}

/**
 * @param {HTMLElement} element Canvas element to draw on
 * @returns {module:canvas} Our canvas object
 */
export default function canvasFunction(element) {
  const _element = element.getContext('2d');
  const _tilesetCollection = {};
  const _entityCollection = [];
  let _runtime = 0;

  const _renderEntity = entity => entity.render(_element, _tilesetCollection[entity.tileset.src], _runtime);

  /** @alias module:canvas */
  const methods = {
    /**
     * Render our canvas.
     *
     * @param {Number} runtime When our render was triggered in relation to the start of our game loop
     */
    render(runtime) {
      _runtime = runtime;
      _element.clearRect(0, 0, SIZER.width, SIZER.height);
      _entityCollection.sort(SpriteFactory.sort).forEach(_renderEntity);
    },

    /**
     * Add an entity to be drawn.
     *
     * @param {Object} entity Entity that we will trigger rendering events on
     */
    addEntity(entity) {
      _entityCollection.push(entity);
    },

    /**
     * Remove a specific entity.
     *
     * @param {Object} entity Entity we no longer need to check rendering for
     */
    removeEntity(entity) {
      for (let i = 0, count = _entityCollection.length; i < count; ++i) {
        if (_entityCollection[i] !== entity) {
          continue;
        }
        _entityCollection.splice(i, 1);
      }
    },

    /**
     * Define the tilesets to use for a given level. Trigger `callback` when all images are loaded.
     *
     * @param {Array} tilesets Tilesets to load for a given level/area. We will loop through these and load them into
     *   memory
     * @param {callback} callback Callback to run after we are finished loading our tilesets
     */
    loadTilesets(tilesets, callback) {
      const waitingFor = tilesets.length;
      let loaded = 0;
      tilesets.forEach((tileset) => {
        createImageElementForTileset(tileset, (element) => {
          _tilesetCollection[tileset.src] = {
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
