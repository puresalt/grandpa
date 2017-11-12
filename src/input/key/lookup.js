/**
 * NUMBER ONE GRANDPA
 *
 * LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:  * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@puresalt.gg so we can send you a copy immediately.
 *
 */

'use strict';

const LOOKUP = {
  8: 'BACKSPACE',
  9: 'TAB',
  13: 'RETURN',
  16: 'LEFT_SHIFT',
  27: 'ESC',
  32: 'SPACE',
  33: 'PAGEUP',
  34: 'PAGEDOWN',
  35: 'END',
  36: 'HOME',
  37: 'LEFT',
  38: 'UP',
  39: 'RIGHT',
  40: 'DOWN',
  45: 'INSERT',
  46: 'DELETE',
  48: 'ZERO',
  49: 'ONE',
  50: 'TWO',
  51: 'THREE',
  52: 'FOUR',
  53: 'FIVE',
  54: 'SIX',
  55: 'SEVEN',
  56: 'EIGHT',
  57: 'NINE',
  65: 'A',
  66: 'B',
  67: 'C',
  68: 'D',
  69: 'E',
  70: 'F',
  71: 'G',
  72: 'H',
  73: 'I',
  74: 'J',
  75: 'K',
  76: 'L',
  77: 'M',
  78: 'N',
  79: 'O',
  80: 'P',
  81: 'Q',
  82: 'R',
  83: 'S',
  84: 'T',
  85: 'U',
  86: 'V',
  87: 'W',
  88: 'X',
  89: 'Y',
  90: 'Z',
  112: 'F1',
  113: 'F2',
  114: 'F3',
  115: 'F4',
  116: 'F5',
  117: 'F6',
  118: 'F7',
  119: 'F8',
  120: 'F9',
  192: 'TILDA'
};

const REVERSE_LOOKUP = Object.keys(LOOKUP).reduce((gathered, item) => {
  gathered[LOOKUP[item]] = item;
  return gathered;
}, {});

Object.freeze(LOOKUP);
Object.freeze(REVERSE_LOOKUP);

/**
 * Lookup a given human readable key.
 *
 * @param {Number} key
 * @returns {String|Boolean}
 */
function lookup(key) {
  return LOOKUP[key]
    ? LOOKUP[key]
    : false;
}

/**
 * Get the key's number via a human readable key.
 *
 * @param {String} key
 * @returns {Number|Boolean}
 */
function reverseLookup(key) {
  return REVERSE_LOOKUP[key]
    ? REVERSE_LOOKUP[key]
    : false;
}

export {lookup, reverseLookup};
