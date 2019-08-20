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
import ANGLE from '../../../src/movement/direction/angle';
import DIRECTION from '../../../src/movement/direction';
import GUIDED from '../../../src/movement/guided';
import MathUtility from '../../../src/math';
import movementFactory from '../../../src/movement';

const startTime = new Date(2017, 1, 1, 1, 1, 1, 1);

describe('Movement', () => {
  describe('crouch', () => {
    it('should be false by default', () => {
      const movement = movementFactory();
      expect(movement.crouching).to.be.false;
    });

    it('should be true if we are crouching', () => {
      const movement = movementFactory();
      movement.crouch(true);
      expect(movement.crouching).to.be.true;
    });

    it('should be false if we are no longer crouching', () => {
      const movement = movementFactory();
      movement.crouch(false);
      expect(movement.crouching).to.be.false;
    });
  });

  describe('move', () => {
    it('should not be moving if angle === null', () => {
      const movement = movementFactory();
      movement.move(null);
      expect(movement.direction).to.equal(0);
      expect(movement.moving).to.be.false;
      expect(movement.running).to.be.false;
    });

    it('should be facing right if moving right', () => {
      const movement = movementFactory();
      movement.move(ANGLE[DIRECTION.RIGHT]);
      expect(movement.direction).to.equal(ANGLE[DIRECTION.RIGHT]);
      expect(movement.facing).to.equal(DIRECTION.RIGHT);
    });

    it('should be false if we are no longer crouching', () => {
      const movement = movementFactory();
      movement.crouch(false);
      expect(movement.crouching).to.be.false;
    });
  });

  describe('run', () => {
    // Helper for all of the running we will be doing.
    const runInDirection = (direction, movement) => {
      const timer = sinon.useFakeTimers(startTime);
      movement.move(ANGLE[direction]);
      expect(movement.running).to.be.false;
      timer.tick(2);
      movement.move(null);
      expect(movement.running).to.be.false;
      timer.tick(3);
      movement.move(ANGLE[direction]);
      expect(movement.running).to.be.true;
    };

    it('should be running right if moving right within the correct time', () => {
      const movement = movementFactory();
      runInDirection(DIRECTION.RIGHT, movement);
    });

    it('should be running left if moving left within the correct time', () => {
      const movement = movementFactory();
      runInDirection(DIRECTION.LEFT, movement);
    });

    it('should stop running right if we change direction', () => {
      const movement = movementFactory();
      runInDirection(DIRECTION.RIGHT, movement);
      movement.move(ANGLE[DIRECTION.UP_RIGHT] - 1);
      expect(movement.running).to.be.true;
      movement.move(ANGLE[DIRECTION.DOWN_RIGHT] + 1);
      expect(movement.running).to.be.true;
      movement.move(ANGLE[DIRECTION.DOWN]);
      expect(movement.running).to.be.false;
      runInDirection(DIRECTION.RIGHT, movement);
      movement.move(ANGLE[DIRECTION.DOWN_LEFT]);
      expect(movement.running).to.be.false;
      runInDirection(DIRECTION.RIGHT, movement);
      movement.move(ANGLE[DIRECTION.LEFT]);
      expect(movement.running).to.be.false;
      runInDirection(DIRECTION.RIGHT, movement);
      movement.move(ANGLE[DIRECTION.UP_LEFT]);
      expect(movement.running).to.be.false;
      runInDirection(DIRECTION.RIGHT, movement);
      movement.move(ANGLE[DIRECTION.UP]);
      expect(movement.running).to.be.false;
    });

    it('should stop running left if we change direction', () => {
      const movement = movementFactory();
      runInDirection(DIRECTION.LEFT, movement);
      movement.move(ANGLE[DIRECTION.UP_LEFT] + 1);
      expect(movement.running).to.be.true;
      movement.move(ANGLE[DIRECTION.DOWN_LEFT] - 1);
      expect(movement.running).to.be.true;
      movement.move(ANGLE[DIRECTION.DOWN]);
      expect(movement.running).to.be.false;
      runInDirection(DIRECTION.LEFT, movement);
      movement.move(ANGLE[DIRECTION.DOWN_RIGHT]);
      expect(movement.running).to.be.false;
      runInDirection(DIRECTION.LEFT, movement);
      movement.move(ANGLE[DIRECTION.RIGHT]);
      expect(movement.running).to.be.false;
      runInDirection(DIRECTION.LEFT, movement);
      movement.move(ANGLE[DIRECTION.UP_RIGHT]);
      expect(movement.running).to.be.false;
      runInDirection(DIRECTION.LEFT, movement);
      movement.move(ANGLE[DIRECTION.UP]);
      expect(movement.running).to.be.false;
    });
  });

  describe('jump', () => {
    it('should be false by default', () => {
      const movement = movementFactory();
      expect(movement.jumping).to.equal(0);
      expect(movement.guided).to.be.false;
    });

    it('should be true if we are jumping', () => {
      const movement = movementFactory();
      movement.jump(true);
      expect(movement.jumping).to.equal(movement.jumpSpeed);
      expect(movement.guided).to.equal(GUIDED.JUMP);
    });

    it('should not be able to jump again if we are already jumping', () => {
      const movement = movementFactory();
      movement.jump(true);
      const coolDownSpeed = MathUtility.coolDown(movement.jumping); // Used in sprite.update();
      movement.jumping = coolDownSpeed;
      movement.jump(true);
      expect(movement.jumping).to.equal(coolDownSpeed);
    });

    it('should not be able to jump again if we are being guided', () => {
      const movement = movementFactory();
      movement.guided = GUIDED.NARRATIVE;
      movement.jump(true);
      expect(movement.jumping).to.equal(0);
    });

    it('should not be able to jump again if we already fired a jump', () => {
      const movement = movementFactory();
      movement.jump(true, true);
      expect(movement.jumping).to.equal(0);
    });
  });

  describe('punch', () => {
    it('should be false by default', () => {
      const movement = movementFactory();
      expect(movement.punching).to.be.false;
    });

    it('should be current time if we are punching', () => {
      sinon.useFakeTimers(startTime);
      const movement = movementFactory();
      movement.punch(true);
      expect(movement.punching).to.equal(startTime.getTime());
    });

    it('should be false if we are no longer punching', () => {
      const movement = movementFactory();
      movement.punch(false);
      expect(movement.punching).to.be.false;
    });
  });

  describe('kick', () => {
    it('should be false by default', () => {
      const movement = movementFactory();
      expect(movement.kicking).to.be.false;
    });

    it('should be current time if we are punching', () => {
      sinon.useFakeTimers(startTime);
      const movement = movementFactory();
      movement.kick(true);
      expect(movement.kicking).to.equal(startTime.getTime());
    });

    it('should be false if we are no longer punching', () => {
      const movement = movementFactory();
      movement.kick(false);
      expect(movement.kicking).to.be.false;
    });
  });
});
