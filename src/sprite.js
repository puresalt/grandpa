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
    jump: null,
    movement: movementFactory(),

    /**
     * Render an update.
     */
    update(fps) {

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
        SIZER.relativeSize(this.width),
        SIZER.relativeSize(this.height)
      );
    },

    detectJumpLocation() {
      if (this.jump === null) {
        let degree = this.movement.moving === null
          ? ANGLE[DIRECTION.UP]
          : parseInt(this.movement.moving);
        const angle = -1 * (degree * Math.PI * 2) / 360;
        this.jump = {
          origin: {
            x: Math.round(this.x + (SIZER.relativeSize(this.width) / 2)),
            y: Math.round(this.y + SIZER.relativeSize(this.height))
          },
          air: {
            width: SIZER.relativeSize(160),
            height: SIZER.relativeSize(40),
            angle: angle
          },
          ground: {
            width: SIZER.relativeSize(300),
            height: SIZER.relativeSize(75),
            angle: angle
          }
        };

        const jumpEllipsePoint = {
          x: Math.round(this.x + (SIZER.relativeSize(this.width) / 2)),
          y: Math.round(this.y - SIZER.relativeSize(this.movement.jumpHeight))
        };
        this.jump.peak = MathUtility.getPointOnEllipse(jumpEllipsePoint, this.jump.air);
        this.jump.destination = (this.movement.moving === null)
          ? {x: this.jump.origin.x, y: this.jump.origin.y}
          : MathUtility.getPointOnEllipse(this.jump.origin, this.jump.ground);
        this.jump.control = {
          x: Math.round((this.jump.peak.x / (2 * JUMP_PEAK_REFERENCE * (1 - JUMP_PEAK_REFERENCE))) - (this.jump.origin.x * JUMP_PEAK_REFERENCE / (2 * (1 - JUMP_PEAK_REFERENCE))) - (this.jump.destination.x * (1 - JUMP_PEAK_REFERENCE) / (2 * JUMP_PEAK_REFERENCE))),
          y: Math.round((this.jump.peak.y / (2 * JUMP_PEAK_REFERENCE * (1 - JUMP_PEAK_REFERENCE))) - (this.jump.origin.y * JUMP_PEAK_REFERENCE / (2 * (1 - JUMP_PEAK_REFERENCE))) - (this.jump.destination.y * (1 - JUMP_PEAK_REFERENCE) / (2 * JUMP_PEAK_REFERENCE)))
        };
      }

      const step = this.movement.jumping / (this.movement.jumpHeight * 1.5);
      const {x, y} = MathUtility.getPointOnQuadraticCurve(this.jump.origin, this.jump.control, this.jump.destination, step);
      this.x = Math.round(x - (SIZER.relativeSize(this.width) / 2));
      this.y = Math.round(y - SIZER.relativeSize(this.height));

      this.movement.jumping = MathUtility.coolDown(this.movement.jumping);
      if (!this.movement.jumping) {
        this.x = Math.round(this.jump.destination.x - (SIZER.relativeSize(this.width) / 2));
        this.y = Math.round(this.jump.destination.y - SIZER.relativeSize(this.height));
        this.jump = null;
      }
    },

    /**
     * Detect if we have any movement and change state accordingly.
     */
    detectMovement() {
      const movement = this.movement;

      if (movement.stunned || movement.moving === null) {
        return;
      }

      const maxX = SIZER.width - SIZER.relativeSize(this.width);
      const maxY = SIZER.height - SIZER.relativeSize(this.height);

      let x = this.x;
      let y = this.y;

      let speedX = this.speed.x;
      let speedY = this.speed.y;
      if (movement.running) {
        speedX = Math.round(speedX * 1.75);
        speedY = Math.round(speedY * 1.75);
      }

      let movingAbs = Math.abs(movement.moving);
      if (movement.moving === ANGLE[DIRECTION.RIGHT]) {
        x = x + SIZER.relativeSize(speedX);
      } else if (movement.moving === ANGLE[DIRECTION.LEFT]) {
        x = x - SIZER.relativeSize(speedX);
      } else if (movement.moving === ANGLE[DIRECTION.UP]) {
        y = y - SIZER.relativeSize(speedY);
      } else if (movement.moving === ANGLE[DIRECTION.DOWN]) {
        y = y + SIZER.relativeSize(speedY);
      } else if (movement.moving >= ANGLE[DIRECTION.RIGHT] && movement.moving < ANGLE[DIRECTION.UP]) {
        if (movement.moving <= ANGLE[DIRECTION.UP_RIGHT]) {
          x = x + SIZER.relativeSize(speedX);
          y = y - SIZER.relativeSize(speedY * ((movingAbs - ANGLE[DIRECTION.RIGHT]) / DEGREES_PER_SLICE));
        } else {
          x = x + SIZER.relativeSize(speedX * (1 - ((movingAbs - ANGLE[DIRECTION.UP_RIGHT]) / DEGREES_PER_SLICE)));
          y = y - SIZER.relativeSize(speedY);
        }
      } else if (movement.moving <= ANGLE[DIRECTION.RIGHT] && movement.moving >= ANGLE[DIRECTION.DOWN]) {
        if (movement.moving >= ANGLE[DIRECTION.DOWN_RIGHT]) {
          x = x + SIZER.relativeSize(speedX);
          y = y + SIZER.relativeSize(speedY * ((movingAbs - ANGLE[DIRECTION.RIGHT]) / DEGREES_PER_SLICE));
        } else {
          x = x + SIZER.relativeSize(speedX * (1 - ((movingAbs - ANGLE[DIRECTION.UP_RIGHT]) / DEGREES_PER_SLICE)));
          y = y + SIZER.relativeSize(speedY);
        }
      } else if (movement.moving >= ANGLE[DIRECTION.UP] && movement.moving < ANGLE[DIRECTION.LEFT]) {
        if (movement.moving >= ANGLE[DIRECTION.UP_LEFT]) {
          x = x - SIZER.relativeSize(speedX);
          y = y - SIZER.relativeSize(speedY * (1 - ((movingAbs - ANGLE[DIRECTION.UP_LEFT]) / DEGREES_PER_SLICE)));
        } else {
          x = x - SIZER.relativeSize(speedX * ((movingAbs - ANGLE[DIRECTION.UP]) / DEGREES_PER_SLICE));
          y = y - SIZER.relativeSize(speedY);
        }
      } else {
        if (movement.moving <= ANGLE[DIRECTION.DOWN_LEFT]) {
          x = x - SIZER.relativeSize(speedX);
          y = y + SIZER.relativeSize(speedY * (1 - ((movingAbs - ANGLE[DIRECTION.UP_LEFT]) / DEGREES_PER_SLICE)));
        } else {
          x = x - SIZER.relativeSize(speedX * ((movingAbs - ANGLE[DIRECTION.UP]) / DEGREES_PER_SLICE));
          y = y + SIZER.relativeSize(speedY);
        }
      }
      this.x = MathUtility.minMax(x, 0, maxX);
      this.y = MathUtility.minMax(y, 0, maxY);
    }
  }, loadState || {}));
}
