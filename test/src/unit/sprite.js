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

/* jshint expr:true */
/* globals expect */

'use strict';

import Sprite from '../../../src/sprite/npc';
import SIZER from '../../../src/sizer';
import ANGLE from '../../../src/movement/direction/angle';

describe('Sprite', () => {
  describe('movement', () => {
    it('should allow us to move within our restraints', () => {
      const sprite = Sprite();
      expect(sprite.x).to.equal(0);
      expect(sprite.y).to.equal(0);
      sprite.attemptToMoveTo(5, 3);
      expect(sprite.x).to.equal(5);
      expect(sprite.y).to.equal(3);
      sprite.attemptToMoveTo(SIZER.width + 100000, -1);
      expect(sprite.x).to.be.below(SIZER.width);
      expect(sprite.y).to.equal(0);
      sprite.attemptToMoveTo(-1, SIZER.height + 100000);
      expect(sprite.x).to.equal(0);
      expect(sprite.y).to.be.below(SIZER.width);
    });
  });

  describe('detectMovement', () => {
    it('we should not move if we are not moving', () => {
      const sprite = Sprite();
      const originalX = sprite.x;
      const originalY = sprite.y;
      expect(sprite.movement.moving).to.be.false;
      sprite.detectMovement();
      expect(sprite.x).to.equal(originalX);
      expect(sprite.y).to.equal(originalY);
    });

    describe('we should move directionally', () => {
      it('we should move right', () => {
        const sprite = Sprite();
        const originalX = sprite.x;
        const originalY = sprite.y;
        expect(sprite.movement.moving).to.be.false;
        sprite.movement.move(ANGLE.RIGHT);
        expect(sprite.movement.moving).to.be.true;
        sprite.detectMovement();
        expect(sprite.x).to.be.at.least(originalX + 1);
        expect(sprite.y).to.equal(originalY);
      });

      it('we should move left', () => {
        const sprite = Sprite();
        sprite.x = 1;
        const originalY = sprite.y;
        expect(sprite.movement.moving).to.be.false;
        sprite.movement.move(ANGLE.LEFT);
        expect(sprite.movement.moving).to.be.true;
        sprite.detectMovement();
        expect(sprite.x).to.equal(0);
        expect(sprite.y).to.equal(originalY);
      });

      it('we should move up', () => {
        const sprite = Sprite();
        sprite.y = 1;
        const originalX = sprite.x;
        expect(sprite.movement.moving).to.be.false;
        sprite.movement.move(ANGLE.UP);
        expect(sprite.movement.moving).to.be.true;
        sprite.detectMovement();
        expect(sprite.x).to.equal(originalX);
        expect(sprite.y).to.equal(0);
      });

      it('we should move down', () => {
        const sprite = Sprite();
        const originalX = sprite.x;
        const originalY = sprite.y;
        expect(sprite.movement.moving).to.be.false;
        sprite.movement.move(ANGLE.DOWN);
        expect(sprite.movement.moving).to.be.true;
        sprite.detectMovement();
        expect(sprite.x).to.equal(originalX);
        expect(sprite.y).to.be.at.least(originalY + 1);
      });

      it('we should move up right', () => {
        const sprite = Sprite();
        const originalX = sprite.x;
        sprite.y = 1;
        expect(sprite.movement.moving).to.be.false;
        sprite.movement.move(ANGLE.UP_RIGHT);
        expect(sprite.movement.moving).to.be.true;
        sprite.detectMovement();
        expect(sprite.x).to.be.at.least(originalX + 1);
        expect(sprite.y).to.equal(0);
      });

      it('we should move up left', () => {
        const sprite = Sprite();
        sprite.x = 1;
        sprite.y = 1;
        expect(sprite.movement.moving).to.be.false;
        sprite.movement.move(ANGLE.UP_LEFT);
        expect(sprite.movement.moving).to.be.true;
        sprite.detectMovement();
        expect(sprite.x).to.equal(0);
        expect(sprite.y).to.equal(0);
      });

      it('we should move down right', () => {
        const sprite = Sprite();
        const originalX = sprite.x;
        const originalY = sprite.y;
        expect(sprite.movement.moving).to.be.false;
        sprite.movement.move(ANGLE.DOWN_RIGHT);
        expect(sprite.movement.moving).to.be.true;
        sprite.detectMovement();
        expect(sprite.x).to.be.at.least(originalX + 1);
        expect(sprite.y).to.be.at.least(originalY + 1);
      });

      it('we should move down left', () => {
        const sprite = Sprite();
        sprite.x = 1;
        const originalY = sprite.y;
        expect(sprite.movement.moving).to.be.false;
        sprite.movement.move(ANGLE.DOWN_LEFT);
        expect(sprite.movement.moving).to.be.true;
        sprite.detectMovement();
        expect(sprite.x).to.equal(0);
        expect(sprite.y).to.be.at.least(originalY + 1);
      });
    });
  });

  describe('reset should match the signature', () => {
    const sprite = Sprite();
    const originalName = sprite.name;
    sprite.name = sprite.name + ' New Name';
    expect(sprite.name).to.not.equal(originalName);
    sprite.reset();
    expect(sprite.name).to.equal(originalName);
  });

});
