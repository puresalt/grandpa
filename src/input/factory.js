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

/** @module input/factory */

'use strict';

import INPUT_TYPE from './type';
import keyboardInput from './keyboard';
import touchInput from './touch';

const allowedInputs = {
  [INPUT_TYPE.KEYBOARD]: keyboardInput,
  [INPUT_TYPE.TOUCH]: touchInput
};
Object.freeze(allowedInputs);

/**
 * Build a factory of our allowed Inputs.
 *
 * @param {Object} config Game config settings
 * @param {Object} inputState Default input state (generally loaded from a save state)
 * @param {StateMachine=} context Our global state machine, if it exists
 * @returns {{add: Function, getConfig: Function, remove: Function}} Either `module:input/touch` or
 *   `module:input/keyboard`, where the later is the default.
 * @alias module:input/factory
 */
export default function InputFactory(config, inputState, context) {
  if (allowedInputs[config.type]) {
    return allowedInputs[config.type](config, inputState, context);
  }
  return allowedInputs[INPUT_TYPE.KEYBOARD](config, inputState, context);
}
