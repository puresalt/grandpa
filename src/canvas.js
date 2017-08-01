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

export default class Canvas {

  /**
   * Canvas will wrap our canvas tag and work as a middle man.
   *
   * @param {HTMLCanvasElement} element
   */
  constructor(element) {
    this.setElement(element);
    this.clearEntities();
    this.clearTilesets();
  }

  /**
   * Get our canvas element.
   *
   * @returns {CanvasRenderingContext2D}
   */
  getCanvas() {
    return this._element;
  }

  /**
   * Set the canvas element for our canvas.
   *
   * @param {HTMLCanvasElement} canvas
   * @returns {Canvas}
   */
  setElement(canvas) {
    this._element = canvas.getContext('2d');
    return this;
  }

  addEntity(element) {
    this._entities.push(element);
    return this;
  }

  clearEntities() {
    this.setEntities([]);
    return this;
  }

  removeEntity(element) {
    this._entities = this._entities.filter(item => {
      return item.id !== element.id;
    });
    return this;
  }

  setEntities(elements) {
    this._entities = elements;
    return this;
  }

  addTileset(tileset) {
    this._tilesets[tileset.id] = tileset;
    return this;
  }

  clearTilesets() {
    this.setTilesets({});
    return this;
  }

  removeTileset(tileset) {
    this._tilesets = this._entities.filter(item => {
      return item.id !== tileset.id;
    });
    return this;
  }

  setTilesets(tilesets) {
    this._tilesets = tilesets;
    return this;
  }

  render(gameLoop) {
    this._entities.forEach(item => {
      let state = item.getState();
      let tileset = this._tilesets[state.tileset.id];
      this._element.drawImage(
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
  }

  static createImageElementForTileset(tileset) {
    let element = document.createElement('image');
    element.src = tileset.src;
    element.id = 'tileset-' + tileset.id;
    return element;
  }
}
