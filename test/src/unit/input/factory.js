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

import INPUT_TYPE from '../../../../src/input/type';
import InputFactory from '../../../../src/input/factory';
import InputState from '../../../../src/input/state';

const inputState = InputState({});

describe('InputFactory', () => {
  it('should return a touch input', () => {
    const input = InputFactory({type: INPUT_TYPE.TOUCH}, inputState);
    const type = input.getConfig().type;
    expect(type).to.equal(INPUT_TYPE.TOUCH);
    expect(type).to.not.equal(INPUT_TYPE.KEYBOARD);
  });

  it('should return a keyboard input', () => {
    const input = InputFactory({type: INPUT_TYPE.KEYBOARD}, inputState);
    const type = input.getConfig().type;
    expect(type).to.equal(INPUT_TYPE.KEYBOARD);
    expect(type).to.not.equal(INPUT_TYPE.TOUCH);
  });

  it('should return a keyboard input if unknown', () => {
    const input = InputFactory({type: 'unknown'}, inputState);
    const type = input.getConfig().type;
    expect(type).to.equal(INPUT_TYPE.KEYBOARD);
    expect(type).to.not.equal(INPUT_TYPE.TOUCH);
  });
});
