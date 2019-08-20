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

/** @module sizer/static */

'use strict';

import EVENT from '../event';
import PubSub from '../pubSub';
import MathUtility from '../math';

const globalPubSub = PubSub.singleton();
let _canvasElement = null;

/**
 * Resize our elements in a static manner. All values are hard coded and then stretched using built in canvas functions.
 *
 * @alias module:sizer/static
 */
const Sizer = {
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
   * @param {HTMLElement} canvasElement A Canvas tag that we will be resizing based off of a browser's viewport
   * @returns {Sizer} Our Sizer that will help manipulate our canvas and entities as needed
   */
  init(canvasElement) {
    _canvasElement = canvasElement;
    return this;
  },

  /**
   * Get the desired sizing based on size of the window.
   *
   * @returns {Sizer} Our Sizer that will help manipulate our canvas and entities as needed
   */
  update() {
    if (_canvasElement === null) {
      return this;
    }

    let height = Math.max(window.innerHeight, document.documentElement.clientHeight, document.body.clientHeight);
    let width = Math.max(window.innerWidth, document.documentElement.clientWidth, document.body.clientWidth);
    if (height / width < this.aspect.height / this.aspect.width) {
      width = MathUtility.round((height * 16) / 9);
    } else {
      height = MathUtility.round((width * 9) / 16);
    }
    this.ratio = height / this.defaultHeight;

    _canvasElement.style.transformOrigin = '0 0'; //scale from top left
    _canvasElement.style.transform = 'scale(' + this.ratio + ')';

    globalPubSub.publish(EVENT.RESIZE, this);
    return this;
  },

  /**
   * Get the size of our pixel in relation to the ratio.
   *
   * @param {Number} pixel Pixels we want to find their relative value for
   * @returns {Number} Drawing perfect pixels
   */
  relativeSize(pixel) {
    return MathUtility.round(pixel);
  }
};

export default Sizer;
