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

export default function collection(items) {
  const _items = items;

  return {
    all() {
      return _items;
    },
    push() {

    },
    pop() {
      return _items.pop();
    },
    shift() {
      return _items.shift();
    },
    unshift() {

    },
    map(func) {
      _items.map(func);
    }
  };
}