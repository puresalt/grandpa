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
/* globals requestAnimationFrame,CustomEvent,window */

'use strict';

import relativeSizer from './sizer/relative';
import staticSizer from './sizer/static';

const allowedSizers = {
  relative: relativeSizer,
  static: staticSizer
};
Object.freeze(allowedSizers);

const _Sizer = allowedSizers.static;

export default _Sizer;

(() => {
  const throttle = (type, name, obj) => {
    obj = obj || window;
    let running = false;
    const func = () => {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  /* init - you can init any event */
  throttle('resize', 'optimizedResize');
})();

// handle event
window.addEventListener('optimizedResize', () => {
  _Sizer.update();
});
