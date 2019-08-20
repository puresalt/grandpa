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

import Sprite from '../../../src/sprite/npc';
import SIZER from '../../../src/sizer';
import ANGLE from '../../../src/movement/direction/angle';
import MathUtility from '../../../src/math';
import DIRECTION from '../../../src/movement/direction';

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
    const createOriginPoint = (sprite) => {
      sprite.x = sprite.speed.x * sprite.speed.running;
      sprite.y = sprite.speed.y * sprite.speed.running;
      return {
        x: sprite.x,
        y: sprite.y
      };
    };

    it('we should not move if we are not moving', () => {
      const sprite = Sprite();
      const origin = createOriginPoint(sprite);

      expect(sprite.movement.moving).to.be.false;
      sprite.detectMovement();
      expect(sprite.x).to.equal(origin.x);
      expect(sprite.y).to.equal(origin.y);
    });

    describe('directional', () => {
      it('we should move right', () => {
        const sprite = Sprite();
        const origin = createOriginPoint(sprite);

        expect(sprite.movement.moving).to.be.false;

        sprite.movement.move(ANGLE.RIGHT);
        expect(sprite.movement.moving).to.be.true;

        sprite.detectMovement();
        expect(sprite.x).to.equal(origin.x + sprite.speed.x);
        expect(sprite.y).to.equal(origin.y);
      });

      it('we should move left', () => {
        const sprite = Sprite();
        const origin = createOriginPoint(sprite);

        expect(sprite.movement.moving).to.be.false;

        sprite.movement.move(ANGLE.LEFT);
        expect(sprite.movement.moving).to.be.true;

        sprite.detectMovement();
        expect(sprite.x).to.equal(origin.x - sprite.speed.x);
        expect(sprite.y).to.equal(origin.y);
      });

      it('we should move up', () => {
        const sprite = Sprite();
        const origin = createOriginPoint(sprite);

        expect(sprite.movement.moving).to.be.false;

        sprite.movement.move(ANGLE.UP);
        expect(sprite.movement.moving).to.be.true;

        sprite.detectMovement();
        expect(sprite.x).to.equal(origin.x);
        expect(sprite.y).to.equal(origin.y - sprite.speed.y);
      });

      it('we should move down', () => {
        const sprite = Sprite();
        const origin = createOriginPoint(sprite);

        expect(sprite.movement.moving).to.be.false;

        sprite.movement.move(ANGLE.DOWN);
        expect(sprite.movement.moving).to.be.true;

        sprite.detectMovement();
        expect(sprite.x).to.equal(origin.x);
        expect(sprite.y).to.equal(origin.y + sprite.speed.y);
      });

      describe('diagonalMovement', () => {
        describe('walking', () => {
          it('we should move up right', () => {
            const sprite = Sprite();
            const origin = createOriginPoint(sprite);

            expect(sprite.movement.moving).to.be.false;

            sprite.movement.move(ANGLE.UP_RIGHT);
            expect(sprite.movement.moving).to.be.true;

            sprite.detectMovement();
            expect(sprite.x).to.equal(origin.x + sprite.speed.x);
            expect(sprite.y).to.equal(origin.x - sprite.speed.y);
          });

          it('we should move up left', () => {
            const sprite = Sprite();
            const origin = createOriginPoint(sprite);

            expect(sprite.movement.moving).to.be.false;

            sprite.movement.move(ANGLE.UP_LEFT);
            expect(sprite.movement.moving).to.be.true;

            sprite.detectMovement();
            expect(sprite.x).to.equal(origin.x - sprite.speed.x);
            expect(sprite.y).to.equal(origin.x - sprite.speed.y);
          });

          it('we should move down right', () => {
            const sprite = Sprite();
            const origin = createOriginPoint(sprite);

            expect(sprite.movement.moving).to.be.false;

            sprite.movement.move(ANGLE.DOWN_RIGHT);
            expect(sprite.movement.moving).to.be.true;

            sprite.detectMovement();
            expect(sprite.x).to.equal(origin.x + sprite.speed.x);
            expect(sprite.y).to.equal(origin.y + sprite.speed.y);
          });

          it('we should move down left', () => {
            const sprite = Sprite();
            const origin = createOriginPoint(sprite);

            expect(sprite.movement.moving).to.be.false;

            sprite.movement.move(ANGLE.DOWN_LEFT);
            expect(sprite.movement.moving).to.be.true;

            sprite.detectMovement();
            expect(sprite.x).to.equal(origin.x - sprite.speed.x);
            expect(sprite.y).to.equal(origin.y + sprite.speed.y);
          });
        });

        const createAndCompareRunningSpritePosition = (movement) => {
          const sprite = Sprite();
          const origin = createOriginPoint(sprite);

          sprite.movement.running = true;
          sprite.movement.move(movement);
          sprite.detectMovement();

          return {
            origin,
            sprite,
            test(expectedX, expectedY) {
              expect(sprite.x).to.equal(expectedX);
              expect(sprite.y).to.equal(expectedY);
            }
          };
        };

        describe('running', () => {
          it('we should run up right', () => {
            const {sprite, origin, test} = createAndCompareRunningSpritePosition(ANGLE.UP_RIGHT);
            test(origin.x + sprite.speed.x, origin.y - sprite.speed.y);
          });

          it('we should run up right tapered based on upper angle', () => {
            const movementAngle = ANGLE[DIRECTION.UP_RIGHT] - 15;
            const {sprite, origin, test} = createAndCompareRunningSpritePosition(movementAngle);
            test(
              origin.x + (sprite.speed.running * sprite.speed.x),
              origin.y - Math.round(sprite.speed.y * sprite.speed.running * MathUtility.getTaperedRunningRate(movementAngle, ANGLE[DIRECTION.RIGHT]))
            );
          });

          it('we should run up right tapered based on lower angle', () => {
            const movementAngle = ANGLE[DIRECTION.UP_RIGHT] + 15;
            const {sprite, origin, test} = createAndCompareRunningSpritePosition(movementAngle);
            test(
              origin.x + Math.round(sprite.speed.x * (1 - MathUtility.getTaperedRunningRate(Math.abs(movementAngle), ANGLE[DIRECTION.UP_RIGHT]))),
              origin.y - sprite.speed.y
            );
          });

          it('we should run up left', () => {
            const {sprite, origin, test} = createAndCompareRunningSpritePosition(ANGLE.UP_LEFT);
            test(origin.x - sprite.speed.x, origin.y - sprite.speed.y);
          });

          it('we should run up left tapered based on upper angle', () => {
            const movementAngle = ANGLE[DIRECTION.UP_LEFT] - 15;
            const {sprite, origin, test} = createAndCompareRunningSpritePosition(movementAngle);
            test(
              origin.x - Math.round(sprite.speed.x * sprite.speed.running * (1 - MathUtility.getTaperedRunningRate(movementAngle, ANGLE[DIRECTION.UP]))),
              origin.y - sprite.speed.y
            );
          });

          it('we should run up left tapered based on lower angle', () => {
            const movementAngle = ANGLE[DIRECTION.UP_LEFT] + 15;
            const {sprite, origin, test} = createAndCompareRunningSpritePosition(movementAngle);
            test(
              origin.x - sprite.speed.x,
              origin.y - Math.round(sprite.speed.x * (1 - MathUtility.getTaperedRunningRate(Math.abs(movementAngle), ANGLE[DIRECTION.UP_LEFT])))
            );
          });

          it('we should move down right', () => {
            const {sprite, origin, test} = createAndCompareRunningSpritePosition(ANGLE[DIRECTION.DOWN_RIGHT]);
            test(origin.x + sprite.speed.x, origin.y + sprite.speed.y);
          });

          it('we should run down right tapered based on upper angle', () => {
            const movementAngle = ANGLE[DIRECTION.DOWN_RIGHT] - 15;
            const {sprite, origin, test} = createAndCompareRunningSpritePosition(movementAngle);
            test(
              origin.x + Math.round(sprite.speed.x * (1 - MathUtility.getTaperedRunningRate(Math.abs(movementAngle), ANGLE[DIRECTION.UP_RIGHT]))),
              origin.y + sprite.speed.y
            );
          });

          it('we should run down right tapered based on lower angle', () => {
            const movementAngle = ANGLE[DIRECTION.DOWN_RIGHT] + 15;
            const {sprite, origin, test} = createAndCompareRunningSpritePosition(movementAngle);
            test(
              origin.x + (sprite.speed.x * sprite.speed.running),
              origin.y + Math.round(sprite.speed.y * MathUtility.getTaperedRunningRate(movementAngle, ANGLE[DIRECTION.DOWN]))
            );
          });

          it('we should move down left', () => {
            const {sprite, origin, test} = createAndCompareRunningSpritePosition(ANGLE[DIRECTION.DOWN_LEFT]);
            test(origin.x - sprite.speed.x, origin.y + sprite.speed.y);
          });

          it('we should run down left tapered based on upper angle', () => {
            const movementAngle = ANGLE[DIRECTION.DOWN_LEFT] - 15;
            const {sprite, origin, test} = createAndCompareRunningSpritePosition(movementAngle);
            test(
              origin.x - sprite.speed.x,
              origin.y + Math.round(sprite.speed.y * (1 - MathUtility.getTaperedRunningRate(Math.abs(movementAngle), ANGLE[DIRECTION.UP_LEFT])))
            );
          });

          it('we should run down left tapered based on lower angle', () => {
            const movementAngle = ANGLE[DIRECTION.DOWN_LEFT] + 15;
            const {sprite, origin, test} = createAndCompareRunningSpritePosition(movementAngle);
            test(
              origin.x - Math.round(sprite.speed.y * MathUtility.getTaperedRunningRate(Math.abs(movementAngle), ANGLE[DIRECTION.UP])),
              origin.y + sprite.speed.y
            );
          });
        });
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
