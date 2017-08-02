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

function elementLoader(element, callback) {
  let loaded = false;
  element.onload = element.onreadystatechange = function() {
    if (!loaded && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
      loaded = true;
      element.onload = element.onreadystatechange = null;
      callback && callback();
    }
  };
}

function createImageElementForTileset(tileset, callback) {
  let element = document.createElement('image');
  element.src = tileset.src;
  element.id = 'tileset-' + tileset.id;

  if (callback) {
    elementLoader(element.callback);
  }

  return element;
}

export default function Canvas(canvas) {

  const element = canvas.getContext('2d');
  let entities = [];

  return {
    draw: () => {
      entities.forEach(entity => {
        let state = entity.getState();
        let tileset = this._tilesets[state.tileset.id];
        element.drawImage(
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
      entities.push(entity);
    },

    removeEntity: (entity) => {
      entities = entities.filter(item => {
        return item.id !== entity.id;
      });
    },

    clearEntities: () => {
      entities = [];
    }
  };
}