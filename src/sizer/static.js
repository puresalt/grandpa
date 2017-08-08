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

/* jshint maxstatements:17 */
/* globals document,window */

'use strict';

import EVENT from '../event';
import PUB_SUB from '../pubSub';

let _canvasElement = null;

const SIZER = {
  defaultHeight: 360,
  defaultWidth: 640,
  height: 360,
  width: 640,
  ratio: 1,
  aspect: {
    height: 9,
    width: 16
  },

  /**
   * Set what element to use for our sizer.
   *
   * @param {HTMLElement} canvasElement
   * @returns {SIZER}
   */
  init(canvasElement) {
    _canvasElement = canvasElement;
    return this;
  },

  /**
   * Get the desired sizing based on size of the window.
   *
   * @returns {SIZER}
   */
  update() {
    if (_canvasElement === null) {
      return this;
    }

    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (height / width < this.aspect.height / this.aspect.width) {
      width = Math.round((height * 16) / 9);
    } else {
      height = Math.round((width * 9) / 16);
    }
    this.ratio = height / this.defaultHeight;

    _canvasElement.style.transformOrigin = '0 0'; //scale from top left
    _canvasElement.style.transform = 'scale(' + this.ratio + ')';

    PUB_SUB.publish(EVENT.RESIZE, this);
    return this;
  },

  /**
   * Get the size of our pixel in relation to the ratio.
   *
   * @param {Number} pixel
   * @returns {Number}
   */
  relativeSize(pixel) {
    return pixel;
  }
};

export default SIZER;
