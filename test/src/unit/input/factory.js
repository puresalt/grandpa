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

/* jshint expr: true */
/* globals expect */

'use strict';

import InputKeyboard from '../../../../src/input/keyboard';
import InputTouch from '../../../../src/input/touch';
import InputFactory from '../../../../src/input/factory';
import InputState from '../../../../src/input/state';

const inputState = InputState({});
const inputKeyboard = InputKeyboard({}, inputState);
const inputTouch = InputTouch({}, inputState);

describe('InputFactory', () => {
  it('return a touch input', () => {
    const input = JSON.stringify(InputFactory({type: 'touch'}, inputState));
    expect(input.type).to.be.equal(inputTouch.type);
  });

  it('return a keyboard input', () => {
    const input = JSON.stringify(InputFactory({type: 'keyboard'}, inputState));
    expect(input.type).to.be.equal(inputKeyboard.type);
  });

  it('return a keyboard input if unknown', () => {
    const input = JSON.stringify(InputFactory({type: 'unknown'}, inputState));
    expect(input.type).to.be.equal(inputKeyboard.type);
  });
});
