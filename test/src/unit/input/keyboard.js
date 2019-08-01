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
/* globals expect,document,KeyboardEvent */

'use strict';

import INPUT_TYPE from '../../../../src/input/type';
import KEY from '../../../../src/input/key';
import DIRECTION from '../../../../src/movement/direction';
import ANGLE from '../../../../src/movement/direction/angle';
import InputState from '../../../../src/input/state';
import InputKeyboard from '../../../../src/input/keyboard';
import Movement from '../../../../src/movement';
import {reverseLookup} from '../../../../src/input/key/lookup';

/**
 * Create a generic Event
 *
 * @param {String} key
 * @param {String?} eventType
 * @returns {KeyboardEvent}
 * @private
 */
function _createEvent(key, eventType) {
  key = key || reverseLookup('A');
  eventType = eventType || 'keydown';
  const keyBits = key.split('-');
  return new KeyboardEvent(eventType, {
    bubbles: true,
    key: String(key).toLowerCase(),
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    keyCode: parseInt(keyBits[0]),
    location: parseInt(keyBits[1]),
    which: parseInt(keyBits[0])
  });
}

describe('InputKeyboard', () => {
  it('should move UP when the UP key is triggered on our delegated element', () => {
    const element = document.createElement('DIV');
    const movement = Movement();
    const inputState = InputState(movement);
    InputKeyboard({
      element: element,
      keys: [{
        input: KEY.UP, key: reverseLookup('A')
      }]
    }, inputState);
    expect(movement.moving).to.be.false;
    const event = _createEvent(reverseLookup('A'));
    element.dispatchEvent(event);
    expect(movement.moving).to.be.true;
    expect(movement.direction).to.equal(ANGLE[DIRECTION.UP]);
  });

  it('should do nothing if our delegate element doesn\'t understand the keyboard input', () => {
    const element = document.createElement('DIV');
    const movement = Movement();
    const inputState = InputState(movement);
    InputKeyboard({
      element: element,
      keys: [{
        input: KEY.UP, key: reverseLookup('A')
      }]
    }, inputState);
    expect(movement.moving).to.be.false;
    const event = _createEvent(reverseLookup('B'));
    element.dispatchEvent(event);
    expect(movement.moving).to.be.false;
  });

  it('should do nothing if we remove our delegates', () => {
    const element = document.createElement('DIV');
    const movement = Movement();
    const inputState = InputState(movement);
    const input = InputKeyboard({
      element: element,
      keys: [{
        input: KEY.UP, key: reverseLookup('A')
      }]
    }, inputState);
    expect(movement.moving).to.be.false;
    const event = _createEvent(reverseLookup('A'));
    input.remove();
    element.dispatchEvent(event);
    expect(movement.moving).to.be.false;
  });

  it('should trigger again after readding our delegates', () => {
    const element = document.createElement('DIV');
    const movement = Movement();
    const inputState = InputState(movement);
    const input = InputKeyboard({
      element: element,
      keys: [{
        input: KEY.UP, key: reverseLookup('A')
      }]
    }, inputState);
    expect(movement.moving).to.be.false;
    const event = _createEvent(reverseLookup('A'));
    input.remove();
    input.add();
    element.dispatchEvent(event);
    expect(movement.moving).to.be.true;
  });

  it('should give us back some config details', () => {
    const element = document.createElement('DIV');
    const movement = Movement();
    const inputState = InputState(movement);
    const input = InputKeyboard({
      element: element,
      keys: [{
        input: KEY.UP, key: reverseLookup('A')
      }]
    }, inputState);
    const config = input.getConfig();
    expect(config.keys.length).to.equal(1);
    expect(config.type).to.equal(INPUT_TYPE.KEYBOARD);
  });
});
