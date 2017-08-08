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

/* @TODO This is just for testing */

import DIRECTION from './movement/direction';
import ANGLE from './movement/direction/angle';
import SIZER from './sizer';
import MathUtility from './math';
import movementFactory from './movement';

const DEGREES_PER_SLICE = 45;
const JUMP_PEAK_REFERENCE = 0.55;

const _reusedPointObject = {
  x: -1,
  y: -1
};
const _jumpEllipsePoint = {
  x: -1,
  y: -1
};

/**
 * Create a sprite.
 *
 * @param {Object?} loadState
 * @returns {Object}
 */
export default function Sprite(loadState) {
  return Object.assign(Object.create({
    equipment: {
      leftHand: null,
      rightHand: null,
      head: null,
      boots: null,
      accessories: []
    },
    tileset: {
      id: 'blank',
      src: '/assets/sprite/ryan.gif',
      x: 0,
      y: 0
    },
    speed: {
      x: 5,
      y: 5
    },
    x: 0,
    y: 0,
    height: 30,
    width: 30,
    jump: {
      control: {
        x: -1,
        y: -1
      },
      destination: {
        x: -1,
        y: -1
      },
      origin: {
        x: -1,
        y: -1
      },
      peak: {
        x: -1,
        y: -1
      },
      air: {
        width: -1,
        height: -1,
        angle: -1
      },
      ground: {
        width: -1,
        height: -1,
        angle: -1
      }
    },
    movement: movementFactory(),

    /**
     * Render an update.
     */
    update() {

    },

    render(canvas, tileset) {
      canvas.drawImage(
        tileset.image,
        this.tileset.x,
        this.tileset.y,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    },

    detectJumpLocation() {
      if (this.jump.origin.x === -1) {
        const distanceModifier = this.movement.running
          ? 1.25
          : 1;
        const degree = this.movement.moving === null
          ? ANGLE[DIRECTION.UP]
          : parseInt(this.movement.moving);
        const angle = -1 * (degree * Math.PI * 2) / 360;
        this.jump.origin.x = MathUtility.round(this.x + (SIZER.relativeSize(this.width) / 2));
        this.jump.origin.y = MathUtility.round(this.y + SIZER.relativeSize(this.height));
        this.jump.air.width = SIZER.relativeSize(120 * distanceModifier);
        this.jump.air.height = SIZER.relativeSize(30 * distanceModifier);
        this.jump.air.angle = angle;
        this.jump.ground.width = SIZER.relativeSize(200 * distanceModifier);
        this.jump.ground.height = SIZER.relativeSize(50 * distanceModifier);
        this.jump.ground.angle = angle;

        _jumpEllipsePoint.x = MathUtility.round(this.x + (SIZER.relativeSize(this.width) / 2));
        _jumpEllipsePoint.y = MathUtility.round(this.y - SIZER.relativeSize(this.movement.jumpHeight));
        MathUtility.setPointOnEllipse(_jumpEllipsePoint, this.jump.air, _reusedPointObject);
        this.jump.peak.x = MathUtility.round(_reusedPointObject.x);
        this.jump.peak.y = MathUtility.round(_reusedPointObject.y);
        if (this.movement.moving === null) {
          this.jump.destination.x = this.jump.origin.x;
          this.jump.destination.y = this.jump.origin.y;
        } else {
          MathUtility.setPointOnEllipse(this.jump.origin, this.jump.ground, _reusedPointObject);
          this.jump.destination.x = MathUtility.round(_reusedPointObject.x);
          this.jump.destination.y = MathUtility.round(_reusedPointObject.y);
        }
        this.jump.control.x = MathUtility.round((this.jump.peak.x / (2 * JUMP_PEAK_REFERENCE * (1 - JUMP_PEAK_REFERENCE))) - (this.jump.origin.x * JUMP_PEAK_REFERENCE / (2 * (1 - JUMP_PEAK_REFERENCE))) - (this.jump.destination.x * (1 - JUMP_PEAK_REFERENCE) / (2 * JUMP_PEAK_REFERENCE)));
        this.jump.control.y = MathUtility.round((this.jump.peak.y / (2 * JUMP_PEAK_REFERENCE * (1 - JUMP_PEAK_REFERENCE))) - (this.jump.origin.y * JUMP_PEAK_REFERENCE / (2 * (1 - JUMP_PEAK_REFERENCE))) - (this.jump.destination.y * (1 - JUMP_PEAK_REFERENCE) / (2 * JUMP_PEAK_REFERENCE)));
      }
      const step = this.movement.jumping / (this.movement.jumpSpeed);
      this.attemptToMoveTo(
        MathUtility.round(MathUtility.getPointOnQuadraticCurve(this.jump.origin.x, this.jump.control.x, this.jump.destination.x, step) - (SIZER.relativeSize(this.width) / 2)),
        MathUtility.round(MathUtility.getPointOnQuadraticCurve(this.jump.origin.y, this.jump.control.y, this.jump.destination.y, step) - SIZER.relativeSize(this.height))
      );
      this.movement.jumping = MathUtility.coolDown(this.movement.jumping);
      if (!this.movement.jumping) {
        this.attemptToMoveTo(
          MathUtility.round(this.jump.destination.x - (SIZER.relativeSize(this.width) / 2)),
          MathUtility.round(this.jump.destination.y - SIZER.relativeSize(this.height))
        );
        this.jump.origin.x = -1;
      }
    },

    /**
     * Detect if we have any movement and change state accordingly.
     */
    detectMovement() {
      if (this.movement.stunned || this.movement.moving === null) {
        return;
      }

      const runSpeed = this.movement.running
        ? 2
        : 1;
      const speedX = MathUtility.round(this.speed.x * runSpeed);
      const speedY = MathUtility.round(this.speed.y * runSpeed);
      const movingAbs = Math.abs(this.movement.moving);

      let x = this.x;
      let y = this.y;
      if (this.movement.moving === ANGLE[DIRECTION.RIGHT]) {
        x += SIZER.relativeSize(speedX);
      } else if (this.movement.moving === ANGLE[DIRECTION.LEFT]) {
        x -= SIZER.relativeSize(speedX);
      } else if (this.movement.moving === ANGLE[DIRECTION.UP]) {
        y -= SIZER.relativeSize(speedY);
      } else if (this.movement.moving === ANGLE[DIRECTION.DOWN]) {
        y += SIZER.relativeSize(speedY);
      } else if (this.movement.moving >= ANGLE[DIRECTION.RIGHT] && this.movement.moving < ANGLE[DIRECTION.UP]) {
        if (this.movement.moving <= ANGLE[DIRECTION.UP_RIGHT]) {
          x += SIZER.relativeSize(speedX);
          y -= SIZER.relativeSize(speedY * ((movingAbs - ANGLE[DIRECTION.RIGHT]) / DEGREES_PER_SLICE));
        } else {
          x += SIZER.relativeSize(speedX * (1 - ((movingAbs - ANGLE[DIRECTION.UP_RIGHT]) / DEGREES_PER_SLICE)));
          y -= SIZER.relativeSize(speedY);
        }
      } else if (this.movement.moving <= ANGLE[DIRECTION.RIGHT] && this.movement.moving >= ANGLE[DIRECTION.DOWN]) {
        if (this.movement.moving >= ANGLE[DIRECTION.DOWN_RIGHT]) {
          x += SIZER.relativeSize(speedX);
          y += SIZER.relativeSize(speedY * ((movingAbs - ANGLE[DIRECTION.RIGHT]) / DEGREES_PER_SLICE));
        } else {
          x += SIZER.relativeSize(speedX * (1 - ((movingAbs - ANGLE[DIRECTION.UP_RIGHT]) / DEGREES_PER_SLICE)));
          y += SIZER.relativeSize(speedY);
        }
      } else if (this.movement.moving >= ANGLE[DIRECTION.UP] && this.movement.moving < ANGLE[DIRECTION.LEFT]) {
        if (this.movement.moving >= ANGLE[DIRECTION.UP_LEFT]) {
          x -= SIZER.relativeSize(speedX);
          y -= SIZER.relativeSize(speedY * (1 - ((movingAbs - ANGLE[DIRECTION.UP_LEFT]) / DEGREES_PER_SLICE)));
        } else {
          x -= SIZER.relativeSize(speedX * ((movingAbs - ANGLE[DIRECTION.UP]) / DEGREES_PER_SLICE));
          y -= SIZER.relativeSize(speedY);
        }
      } else {
        if (this.movement.moving <= ANGLE[DIRECTION.DOWN_LEFT]) {
          x = x - SIZER.relativeSize(speedX);
          y = y + SIZER.relativeSize(speedY * (1 - ((movingAbs - ANGLE[DIRECTION.UP_LEFT]) / DEGREES_PER_SLICE)));
        } else {
          x = x - SIZER.relativeSize(speedX * ((movingAbs - ANGLE[DIRECTION.UP]) / DEGREES_PER_SLICE));
          y = y + SIZER.relativeSize(speedY);
        }
      }
      this.attemptToMoveTo(MathUtility.minMax(x, 0, SIZER.width - SIZER.relativeSize(this.width)), MathUtility.minMax(y, 0, SIZER.height - SIZER.relativeSize(this.height)));
    },

    /**
     * Attempt to move a sprite to a given location. Do collision detection or other outside influences.
     *
     * @param x
     * @param y
     */
    attemptToMoveTo(x, y) {
      this.x = MathUtility.minMax(x, 0, SIZER.width - SIZER.relativeSize(this.width));
      this.y = MathUtility.minMax(y, (this.movement.jumping ? this.jump.peak.y - SIZER.relativeSize(this.height) : 0), SIZER.height - SIZER.relativeSize(this.height));
    }
  }, loadState || {}));
}
