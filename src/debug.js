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

import inputKeyLookup from './input/key/lookup';

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
  update(player, inputState, gameLoop) {
    if (!_overlay) {
      return;
    }
    if (!_displayed) {
      _overlay.style.display = 'none';
      return;
    }
    _overlay.style.display = 'block';

    let definedKeys = inputState.getConfig().keys;
    let keys = [
      '<strong>KEYS:</strong><hr>'
    ];
    for (let i = 0, count = definedKeys.length; i < count; i = i + 1) {
      keys.push(stylizeKey(definedKeys[i].input) + '<span class="on">' + inputKeyLookup(definedKeys[i].keyCode) + '</span>');
    }

    let stats = [
      '<strong>STATE:</strong><hr>',
      stylizeKey('fps') + stylizeValue(gameLoop.getRenderedFps())
    ];

    let _movement = player.movement;
    for (let i = 0, count = _movementKeys.length; i < count; i = i + 1) {
      let key = _movementKeys[i];
      stats.push(stylizeKey(key) + stylizeValue(_movement[key]));
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
  let length = 9;
  let padding = '';
  for (let i = 0; i < length; i = i + 1) {
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
