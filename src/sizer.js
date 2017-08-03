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

export default {
  defaultHeight: 720,
  defaultWidth: 1280,
  height: 720,
  width: 1280,
  maxHeight: 1080,
  maxWidth: 1920,
  ratio: 1,
  aspect: {
    width: 16,
    height: 9
  },

  /**
   * Get the desired sizing based on size of the window.
   *
   * @param {HTMLElement} canvasElement
   */
  update(canvasElement) {
    let height = document.documentElement.clientHeight;
    let width = document.documentElement.clientWidth;
    if (height === this.height && width === this.width) {
      return;
    }
    if (height > this.maxHeight) {
      height = this.maxHeight;
    }
    width = Math.round((height * 16) / 9);
    if (width > this.maxWidth) {
      height = Math.round((width * 9) / 16);
    }
    this.ratio = height / this.defaultHeight;
    this.height = height;
    this.width = width;
    canvasElement.height = height;
    canvasElement.width = width;
    canvasElement.style.height = height + 'px';
    canvasElement.style.width = width + 'px';
    console.log(canvasElement);
    return this;
  },

  /**
   * Get the size of our pixel in relation to the ratio.
   *
   * @param {Number} pixel
   * @returns {Number}
   */
  relativeSize(pixel) {
    return pixel * this.ratio;
  }
};
