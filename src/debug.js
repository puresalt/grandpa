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

/** @module debug */

'use strict';

import INPUT_TYPE from './input/type';
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
Object.freeze(_movementKeys);

let _overlay = null;
let _displayed = false;

/**
 * Debugging output.
 *
 * @alias module:debug
 */
const debug = {
  /**
   * Start up our debugger.
   *
   * @param {Boolean=} [display=false] Whether we should display our debugger or not on start.
   */
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
   *
   * @param {module:sprite/player} player Our player's sprite
   * @param {module:input/state} inputState What our current input state is
   * @param {Number} runtime When our render was triggered in relation to the start of our game loop
   * @param {Number} fps FPS we hit last loop
   */
  update(player, inputState, runtime, fps) {
    if (!_overlay) {
      return;
    }
    if (!_displayed) {
      _overlay.style.display = 'none';
      return;
    }
    _overlay.style.display = 'block';

    const {type, keys} = inputConfig.type;
    const output = [
      `<strong>${(type === INPUT_TYPE.KEYBOARD ? 'KEYS' : 'BUTTONS')}:</strong><hr>`
    ];
    keys.forEach(row => output.push([
      stylizeKey(row.input),
      '<span class="on">',
      (type === INPUT_TYPE.KEYBOARD ? lookup(row.key) : '#' + row.element.id),
      '</span>'
    ].join('')));

    const stats = [
      '<strong>STATE:</strong><hr>',
      stylizeKey('runtime') + stylizeValue(MathUtility.round((runtime / 1000) * 100) / 100),
      stylizeKey('fps') + stylizeValue(MathUtility.round(fps * 100) / 100)
    ];
    _movementKeys.forEach(key => stats.push(stylizeKey(key) + stylizeValue(player.movement[key])));
    stats.push(stylizeKey('location') + stylizeValue('(' + player.x + ',' + player.y + ')'));

    _overlay.innerHTML = `<pre>{stats.join('\n')}</pre><pre>${output.join('\n')}</pre><br>`;
  },

  /**
   * Toggle the state of our debugger.
   */
  toggle(pressed) {
    if (!_overlay || !pressed) {
      return;
    }
    _displayed = !_displayed;
  },

  log: {
    error: (...args) => _displayed && console.error(...args),
    debug: (...args) => _displayed && console.debug(...args),
    log: (...args) => _displayed && console.log(...args),
    info: (...args) => _displayed && console.info(...args),
    warn: (...args) => _displayed && console.warn(...args)
  }
};
Object.freeze(debug);

export default debug;

/* istanbul ignore next */
/**
 * Stylize a key.
 *
 * @param {*} key
 * @returns {String}
 * @ignore
 */
function stylizeKey(key) {
  const length = 9;
  let padding = '';
  for (let i = 0; i < length; ++i) {
    padding = padding + ' ';
  }

  return `<strong>${String(key.toUpperCase() + padding).slice(0, length)}</strong>`;
}

/* istanbul ignore next */
/**
 * Stylize a value.
 *
 * @param {*} value
 * @returns {String}
 * @ignore
 */
function stylizeValue(value) {
  if (value === null) {
    return '<em>null</em>';
  }

  return `<span class="${(value === false || value === 0) ? 'off' : 'on'}">${value}</span>`;
}
