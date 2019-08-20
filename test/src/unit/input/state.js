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

/* global describe, it, expect */

'use strict';

import sinon from 'sinon';
import StateMachine from '../../../../src/vendor/stateMachine';
import KEY from '../../../../src/input/key';
import DIRECTION from '../../../../src/movement/direction';
import ANGLE from '../../../../src/movement/direction/angle';
import EVENT from '../../../../src/event';
import InputState from '../../../../src/input/state';
import Movement from '../../../../src/movement';

const startDateTime = new Date(2017, 1, 1, 1, 1, 1, 1);
const startTime = startDateTime.getTime();
sinon.useFakeTimers(startDateTime);

describe('InputState', () => {
  it('should move RIGHT when that direction is triggered', () => {
    const movement = Movement();
    const loadState = {};
    const inputState = InputState(movement, loadState);
    inputState.triggerEvent(EVENT.PRESS, KEY.RIGHT);
    expect(loadState.RIGHT).to.be.true;
    expect(movement.facing).to.equal(DIRECTION.RIGHT);
    expect(movement.moving).to.be.true;
    expect(movement.direction).to.equal(ANGLE[DIRECTION.RIGHT]);
  });

  it('should move UP_RIGHT when that direction is triggered', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    inputState.triggerEvent(EVENT.PRESS, KEY.RIGHT);
    inputState.triggerEvent(EVENT.PRESS, KEY.UP);
    expect(movement.facing).to.equal(DIRECTION.RIGHT);
    expect(movement.moving).to.be.true;
    expect(movement.direction).to.equal(ANGLE[DIRECTION.UP_RIGHT]);
  });

  it('should move UP when that direction is triggered', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    inputState.triggerEvent(EVENT.PRESS, KEY.UP);
    expect(movement.facing).to.equal(DIRECTION.RIGHT);
    expect(movement.moving).to.be.true;
    expect(movement.direction).to.equal(ANGLE[DIRECTION.UP]);
  });

  it('should move UP_LEFT when that direction is triggered', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    inputState.triggerEvent(EVENT.PRESS, KEY.LEFT);
    inputState.triggerEvent(EVENT.PRESS, KEY.UP);
    expect(movement.facing).to.equal(DIRECTION.LEFT);
    expect(movement.moving).to.be.true;
    expect(movement.direction).to.equal(ANGLE[DIRECTION.UP_LEFT]);
  });

  it('should move LEFT when that direction is triggered', () => {
    const movement = Movement();
    const loadState = {};
    const inputState = InputState(movement, loadState);
    inputState.triggerEvent(EVENT.PRESS, KEY.LEFT);
    expect(movement.facing).to.equal(DIRECTION.LEFT);
    expect(movement.moving).to.be.true;
    expect(movement.direction).to.equal(ANGLE[DIRECTION.LEFT]);
  });

  it('should move DOWN_LEFT when that direction is triggered', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    inputState.triggerEvent(EVENT.PRESS, KEY.LEFT);
    inputState.triggerEvent(EVENT.PRESS, KEY.DOWN);
    expect(movement.facing).to.equal(DIRECTION.LEFT);
    expect(movement.moving).to.be.true;
    expect(movement.direction).to.equal(ANGLE[DIRECTION.DOWN_LEFT]);
  });

  it('should move DOWN when that direction is triggered', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    inputState.triggerEvent(EVENT.PRESS, KEY.DOWN);
    expect(movement.facing).to.equal(DIRECTION.RIGHT);
    expect(movement.moving).to.be.true;
    expect(movement.direction).to.equal(ANGLE[DIRECTION.DOWN]);
  });

  it('should move DOWN_RIGHT when that direction is triggered', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    inputState.triggerEvent(EVENT.PRESS, KEY.RIGHT);
    inputState.triggerEvent(EVENT.PRESS, KEY.DOWN);
    expect(movement.facing).to.equal(DIRECTION.RIGHT);
    expect(movement.moving).to.be.true;
    expect(movement.direction).to.equal(ANGLE[DIRECTION.DOWN_RIGHT]);
  });

  it('should move UP_RIGHT when directional is triggered and angle is UP_RIGHT', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    inputState.triggerEvent(EVENT.PRESS, KEY.DIRECTIONAL, null, ANGLE[DIRECTION.UP_RIGHT]);
  });

  it('should punch if PUNCH is triggered', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    expect(movement.punching).to.be.false;
    inputState.triggerEvent(EVENT.PRESS, KEY.PUNCH);
    expect(movement.punching).to.equal(startTime);
    inputState.triggerEvent(EVENT.RELEASE, KEY.PUNCH);
    expect(movement.punching).to.be.false;
  });

  it('should kick if KICK is triggered', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    expect(movement.kicking).to.be.false;
    inputState.triggerEvent(EVENT.PRESS, KEY.KICK);
    expect(movement.kicking).to.equal(startTime);
    inputState.triggerEvent(EVENT.RELEASE, KEY.KICK);
    expect(movement.kicking).to.be.false;
  });

  it('should crouch if CROUCH is triggered', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    expect(movement.crouching).to.be.false;
    inputState.triggerEvent(EVENT.PRESS, KEY.CROUCH);
    expect(movement.crouching).to.be.true;
    inputState.triggerEvent(EVENT.RELEASE, KEY.CROUCH);
    expect(movement.crouching).to.be.false;
  });

  it('should load menu if MENU is triggered', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    expect(inputState.triggerEvent(EVENT.PRESS, KEY.MENU)).to.be.true;
    // TODO Build the menu screen.
  });

  it('should load debug screen if DEBUG is triggered', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    expect(inputState.triggerEvent(EVENT.PRESS, KEY.DEBUG)).to.be.true;
  });

  it('should trigger nothing if we have an unknown key', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    expect(inputState.triggerEvent(EVENT.PRESS, 'BANANA')).to.be.false;
    expect(inputState.triggerEvent(EVENT.PRESS, KEY.UP)).to.be.true;
  });

  it('should not run an event if our stateMachine doesn\'t allow it', () => {
    const movement = Movement();
    const stateMachine = new StateMachine({
      init: 'loading',
      transitions: [
        {name: 'load', from: ['starting', 'playing'], to: 'loading'},
        {name: 'play', from: 'loading', to: 'playing'}
      ]
    });
    const inputState = InputState(movement);
    expect(inputState.triggerEvent(EVENT.PRESS, KEY.UP, stateMachine)).to.be.false;
    stateMachine.play();
    expect(inputState.triggerEvent(EVENT.PRESS, KEY.UP, stateMachine)).to.be.true;
  });

  it('should give us a list of all keys that state uses', () => {
    const movement = Movement();
    const inputState = InputState(movement);
    expect(inputState.getKeys()).to.be.an('object');
  });
});
