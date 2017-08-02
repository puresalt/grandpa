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

import keyboardInput from './input/keyboard';

const KEY = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN',
  PUNCH: 'PUNCH',
  KICK: 'KICK',
  JUMP: 'JUMP',
  CROUCH: 'CROUCH',
  MENU: 'MENU'
};

const allowedInputs = {
  keyboard: keyboardInput(KEY)
};

/**
 * Build our input.
 *
 * @param {Object} config
 * @param {Array} events
 * @param {StateMachine?} context
 */
function factory(config, events, context) {
  if (allowedInputs[config.type]) {
    return allowedInputs[config.type](config, events, context);
  }
  allowedInputs.keyboard(config, events, context);
}

export default {
  KEY: KEY,
  factory: factory
};
