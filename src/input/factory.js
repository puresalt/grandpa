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

import INPUT_TYPE from './type';
import keyboardInput from './keyboard';
import touchInput from './touch';

const allowedInputs = {};
allowedInputs[INPUT_TYPE.KEYBOARD] = keyboardInput;
allowedInputs[INPUT_TYPE.TOUCH] = touchInput;
Object.freeze(allowedInputs);

/**
 * Build a factory of our allowed Inputs.
 *
 * @param {Object} config
 * @param {Object} inputState
 * @param {StateMachine?} context
 */
export default function InputFactory(config, inputState, context) {
  if (allowedInputs[config.type]) {
    return allowedInputs[config.type](config, inputState, context);
  }
  return allowedInputs[INPUT_TYPE.KEYBOARD](config, inputState, context);
}
