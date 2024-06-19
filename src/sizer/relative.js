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

/** @module sizer/relative */

'use strict';

import EVENT from '../event';
import {singleton as globalPubSub} from '../pubSub';
import MathUtility from '../math';

let _canvasElement = null;

/**
 * Resize our elements in a relative manner.
 *
 * @alias module:sizer/relative
 */
const Sizer = {
  defaultHeight: 360,
  defaultWidth: 640,
  height: 360,
  width: 640,
  maxHeight: 1080,
  maxWidth: 1920,
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

    const maxHeight = Math.max(window.innerHeight, document.documentElement.clientHeight, document.body.clientHeight);
    const maxWidth = Math.max(window.innerWidth, document.documentElement.clientWidth, document.body.clientWidth);
    if (maxHeight === this.maxHeight && maxWidth === this.maxWidth) {
      return this;
    }
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;

    let height = this.maxHeight;
    let width = this.maxWidth;
    if (height / width < this.aspect.height / this.aspect.width) {
      width = MathUtility.round((height * 16) / 9);
    } else {
      height = MathUtility.round((width * 9) / 16);
    }
    this.height = height;
    this.width = width;
    this.ratio = this.height / this.defaultHeight;

    _canvasElement.height = this.height;
    _canvasElement.width = this.width;
    _canvasElement.style.height = this.height + 'px';
    _canvasElement.style.width = this.width + 'px';

    globalPubSub.publish(EVENT.RESIZE, this);
    return this;
  },

  /**
   * Get the size of our pixel in relation to the ratio.
   *
   * @param {Number} pixel Pixels we want to find their relative value for
   * @param {Boolean=} useRatio Whether we should use the current ratio or not
   * @returns {Number} Drawing perfect pixels
   */
  relativeSize(pixel, useRatio) {
    useRatio = useRatio !== false;
    return MathUtility.round(pixel * (useRatio ? this.ratio : 1));
  }
};

export default Sizer;
