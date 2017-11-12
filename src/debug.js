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

import { lookup } from './input/key/lookup';
import MathUtility from './math';

const _movementKeys = [
  'crouching',
  'facing',
  'kicking',
  'punching',
  'jumping',
  'moving',
  'running',
  'stunned'
];

let _overlay = null;
let _displayed = false;

export default {
  init(display) {
    if (_overlay) {
      return;
    }
    _displayed = display;
    _overlay = document.createElement('div');
    _overlay.id = 'debug-output';
    document.body.appendChild(_overlay);
  },

  /**
   * Render a state update.
   */
  update(player, inputState, runtime, fps) {
    /* jshint maxcomplexity:7, maxstatements:18 */
    if (!_overlay) {
      return;
    }
    if (!_displayed) {
      _overlay.style.display = 'none';
      return;
    }
    _overlay.style.display = 'block';

    const inputConfig = inputState.getConfig();
    const inputType = inputConfig.type;
    const definedKeys = inputState.getConfig().keys;
    const keys = [
      '<strong>' + (inputState.getConfig().type === 'keyboard' ? 'KEYS' : 'BUTTONS') + ':</strong><hr>'
    ];
    for (let i = 0, count = definedKeys.length; i < count; ++i) {
      keys.push(stylizeKey(
        definedKeys[i].input)
        + '<span class="on">'
        + (inputType === 'keyboard' ? lookup(definedKeys[i].keyCode) : '#' + definedKeys[i].element.id)
        + '</span>'
      );
    }

    const stats = [
      '<strong>STATE:</strong><hr>',
      stylizeKey('runtime') + stylizeValue(MathUtility.round((runtime / 1000) * 100) / 100),
      stylizeKey('fps') + stylizeValue(MathUtility.round(fps * 100) / 100)
    ];

    for (let i = 0, count = _movementKeys.length; i < count; ++i) {
      const key = _movementKeys[i];
      stats.push(stylizeKey(key) + stylizeValue(player.movement[key]));
    }
    stats.push(stylizeKey('location') + stylizeValue('(' + player.x + ',' + player.y + ')'));

    _overlay.innerHTML = '<pre>' + stats.join('\n') + '</pre><pre>' + keys.join('\n') + '</pre><br>';
  },

  /**
   * Toggle the state of our debugger.
   */
  toggle(pressed) {
    if (!_overlay || !pressed) {
      return;
    }
    _displayed = !_displayed;
  }
};

/**
 * Stylize a key.
 *
 * @param {*} key
 * @returns {String}
 */
function stylizeKey(key) {
  const length = 9;
  let padding = '';
  for (let i = 0; i < length; ++i) {
    padding = padding + ' ';
  }

  return '<strong>' + String(key.toUpperCase() + padding).slice(0, length) + ' : </strong>';
}

/**
 * Stylize a value.
 *
 * @param {*} value
 * @returns {String}
 */
function stylizeValue(value) {
  if (value === null) {
    return '<em>null</em>';
  } else if (value === false || value === 0) {
    return '<span class="off">' + value + '</span>';
  } else {
    return '<span class="on">' + value + '</span>';
  }
}
