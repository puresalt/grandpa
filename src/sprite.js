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
import MathUtility from './utility/math';
import movementFactory from './movement';

const DEGREES_PER_SLICE = 45;

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
    controlPoint: null,
    destinationPoint: null,
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
      if (this.controlPoint === null) {
        const origin = {
          x: Math.round(this.x + (SIZER.relativeSize(this.width) / 2)),
          y: Math.round(this.y + SIZER.relativeSize(this.height))
        };

        let degree = this.movement.moving === null
          ? ANGLE[DIRECTION.UP]
          : parseInt(this.movement.moving);

        const jumpEllipsePoint = {
          x: Math.round(this.x + (SIZER.relativeSize(this.width) / 2)),
          y: Math.round(this.y - SIZER.relativeSize(this.movement.jumpHeight))
        };
        const peak = _ellipsePoint(jumpEllipsePoint, SIZER.relativeSize(100), SIZER.relativeSize(25), degree);
        const destination = _ellipsePoint(origin, SIZER.relativeSize(200), SIZER.relativeSize(50), degree);
        this.destinationPoint = destination;
        const t = 0.55;
        this.controlPoint = {
          x: Math.round((peak.x / (2 * t * (1 - t))) - (origin.x * t / (2 * (1 - t))) - (destination.x * (1 - t ) / (2 * t))),
          y: Math.round((peak.y / (2 * t * (1 - t))) - (origin.y * t / (2 * (1 - t))) - (destination.y * (1 - t ) / (2 * t)))
        };
      }

      this.movement.jumping = MathUtility.coolDown(this.movement.jumping);
      if (!this.movement.jumping) {
        this.controlPoint = null;
        this.destinationPoint = null;
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

/**
 * Get a point along an ellipse.
 *
 * @param {{x: Number, y: Number}} origin
 * @param {Number} width
 * @param {Number} height
 * @param {Number} degree
 * @returns {{x: Number, y: Number}}
 * @private
 */
function _ellipsePoint(origin, width, height, degree) {
  if (degree < 0) {
    degree = 360 + degree;
  }
  const angle = -1 * (degree * Math.PI * 2) / 360;
  return {
    x: origin.x - (height * Math.sin(angle)) * Math.sin(0) + (width * Math.cos(angle)) * Math.cos(0),
    y: origin.y + (width * Math.cos(angle)) * Math.sin(0) + (height * Math.sin(angle)) * Math.cos(0)
  };
}