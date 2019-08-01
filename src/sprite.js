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
import GUIDED from './movement/guided';
import SIZER from './sizer';
import MathUtility from './math';
import movementFactory from './movement';

const _objectType = {
  configurable: false,
  writeable: false,
  value: 'sprite'
};
Object.freeze(_objectType);

const DEGREES_PER_SLICE = 45;
const JUMP_PEAK_REFERENCE = 0.55;

/**
 * Create a sprite.
 *
 * @param {Object?} loadState
 * @returns {Object}
 */
export default function Sprite(loadState) {
  const sprite = Object.assign({}, {
    type: _objectType,
    equipment: {
      leftHand: null,
      rightHand: null,
      head: null,
      boots: null,
      accessories: []
    },
    tileset: {
      src: '/assets/sprite/ryan.gif',
      x: 0,
      y: 0
    },
    tilesetOffset: {
      x: 0,
      y: 0,
      lastTick: 0,
      tick: 0
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
    _gcAvoidance: {
      jumpPoint: {
        x: -1,
        y: -1
      },
      ellipsePoint: {
        x: -1,
        y: -1
      },
      renderingEllipse: {
        angle: -1,
        height: -1,
        width: -1
      },
      point: {
        x: -1,
        y: -1
      }
    },

    movement: movementFactory(),

    /**
     * Render an update.
     */
    update() {
      this.detectJumpLocation();
      this.detectMovement();
    },

    /**
     * Tell a sprite to render itself.
     *
     * @param {CanvasRenderingContext2D} canvas
     * @param {Object} tileset
     * @param {Number} runtime
     */
    render(canvas, tileset, runtime) {
      this._getOffsetPosition(runtime);

      canvas.drawImage(
        tileset.image,
        this.tilesetOffset.x,
        this.tilesetOffset.y,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    },

    detectJumpLocation() {
      if (this.movement.guided !== GUIDED.JUMP) {
        return;
      }

      if (this.jump.origin.x === -1) {
        this._createJumpTrajectory();
      }
      const step = this.movement.jumping / (this.movement.jumpSpeed);
      this.attemptToMoveTo(
        MathUtility.getPointOnQuadraticCurve(
          this.jump.origin.x,
          this.jump.control.x,
          this.jump.destination.x,
          step
        ) - (SIZER.relativeSize(this.width) / 2),
        MathUtility.getPointOnQuadraticCurve(
          this.jump.origin.y,
          this.jump.control.y,
          this.jump.destination.y,
          step
        ) - SIZER.relativeSize(this.height)
      );
      this.movement.jumping = MathUtility.coolDown(this.movement.jumping);
      if (!this.movement.jumping) {
        this.attemptToMoveTo(
          this.jump.destination.x - (SIZER.relativeSize(this.width) / 2),
          this.jump.destination.y - SIZER.relativeSize(this.height)
        );
        this.movement.guided = false;
        this.jump.origin.x = -1;
      }
    },

    /**
     * Detect if we have any movement and change state accordingly.
     */
    detectMovement() {
      if (!this.movement.moving || this.movement.guided) {
        return;
      }

      const runSpeed = this.movement.running
        ? 2
        : 1;
      const speedX = this.speed.x * runSpeed;
      const speedY = this.speed.y * runSpeed;
      const movingAbs = Math.abs(this.movement.direction);

      let x = this.x;
      let y = this.y;
      if (this.movement.direction === ANGLE[DIRECTION.RIGHT]) {
        x += SIZER.relativeSize(speedX);
      } else if (this.movement.direction === ANGLE[DIRECTION.LEFT]) {
        x -= SIZER.relativeSize(speedX);
      } else if (this.movement.direction === ANGLE[DIRECTION.UP]) {
        y -= SIZER.relativeSize(speedY);
      } else if (this.movement.direction === ANGLE[DIRECTION.DOWN]) {
        y += SIZER.relativeSize(speedY);
      } else if (this.movement.direction >= ANGLE[DIRECTION.RIGHT] && this.movement.direction < ANGLE[DIRECTION.UP]) {
        if (this.movement.direction <= ANGLE[DIRECTION.UP_RIGHT]) {
          x += speedX;
          y -= speedY * ((movingAbs - ANGLE[DIRECTION.RIGHT]) / DEGREES_PER_SLICE);
        } else {
          x += speedX * (1 - ((movingAbs - ANGLE[DIRECTION.UP_RIGHT]) / DEGREES_PER_SLICE));
          y -= speedY;
        }
      } else if (this.movement.direction <= ANGLE[DIRECTION.RIGHT] && this.movement.direction >= ANGLE[DIRECTION.DOWN]) {
        if (this.movement.direction >= ANGLE[DIRECTION.DOWN_RIGHT]) {
          x += speedX;
          y += speedY * ((movingAbs - ANGLE[DIRECTION.RIGHT]) / DEGREES_PER_SLICE);
        } else {
          x += speedX * (1 - ((movingAbs - ANGLE[DIRECTION.UP_RIGHT]) / DEGREES_PER_SLICE));
          y += speedY;
        }
      } else if (this.movement.direction >= ANGLE[DIRECTION.UP] && this.movement.direction < ANGLE[DIRECTION.LEFT]) {
        if (this.movement.direction >= ANGLE[DIRECTION.UP_LEFT]) {
          x -= speedX;
          y -= speedY * (1 - ((movingAbs - ANGLE[DIRECTION.UP_LEFT]) / DEGREES_PER_SLICE));
        } else {
          x -= speedX * ((movingAbs - ANGLE[DIRECTION.UP]) / DEGREES_PER_SLICE);
          y -= speedY;
        }
      } else {
        if (this.movement.direction <= ANGLE[DIRECTION.DOWN_LEFT]) {
          x = x - speedX;
          y = y + speedY * (1 - ((movingAbs - ANGLE[DIRECTION.UP_LEFT]) / DEGREES_PER_SLICE));
        } else {
          x = x - speedX * ((movingAbs - ANGLE[DIRECTION.UP]) / DEGREES_PER_SLICE);
          y = y + speedY;
        }
      }
      this.attemptToMoveTo(
        MathUtility.minMax(
          SIZER.relativeSize(x),
          0,
          SIZER.width - SIZER.relativeSize(this.width)
        ),
        MathUtility.minMax(
          SIZER.relativeSize(y),
          0,
          SIZER.height - SIZER.relativeSize(this.height)
        )
      );
    },

    /**
     * Attempt to move a sprite to a given location. Do collision detection or other outside influences.
     *
     * @param x
     * @param y
     */
    attemptToMoveTo(x, y) {
      this.x = MathUtility.round(MathUtility.minMax(
        x,
        0,
        SIZER.width - SIZER.relativeSize(this.width)
      ));
      this.y = MathUtility.round(MathUtility.minMax(
        y,
        this.movement.jumping
          ? this.jump.peak.y - SIZER.relativeSize(this.height)
          : 0,
        SIZER.height - SIZER.relativeSize(this.height)
      ));
    },

    /**
     * Create our jump trajectory in the cases of a good jump.
     */
    _createJumpTrajectory() {
      /* jshint maxstatements:24 */
      const distanceModifier = this.movement.running
        ? 1.25
        : 1;
      const degree = !this.movement.moving
        ? ANGLE[DIRECTION.UP]
        : this.movement.direction;
      const angle = -1 * (degree * Math.PI * 2) / 360;
      this.jump.origin.x = this.x + (SIZER.relativeSize(this.width) / 2);
      this.jump.origin.y = this.y + SIZER.relativeSize(this.height);
      this.jump.air.width = SIZER.relativeSize(120 * distanceModifier);
      this.jump.air.height = SIZER.relativeSize(30 * distanceModifier);
      this.jump.air.angle = angle;
      this.jump.ground.width = SIZER.relativeSize(200 * distanceModifier);
      this.jump.ground.height = SIZER.relativeSize(50 * distanceModifier);
      this.jump.ground.angle = angle;

      this._gcAvoidance.ellipsePoint.x = this.x + (SIZER.relativeSize(this.width) / 2);
      this._gcAvoidance.ellipsePoint.y = this.y - SIZER.relativeSize(this.movement.jumpHeight);
      MathUtility.setPointOnEllipse(this._gcAvoidance.ellipsePoint, this.jump.air, this._gcAvoidance.point);
      this.jump.peak.x = this._gcAvoidance.point.x;
      this.jump.peak.y = this._gcAvoidance.point.y;
      if (!this.movement.moving) {
        this.jump.destination.x = this.jump.origin.x;
        this.jump.destination.y = this.jump.origin.y;
      } else {
        MathUtility.setPointOnEllipse(this.jump.origin, this.jump.ground, this._gcAvoidance.point);
        this.jump.destination.x = this._gcAvoidance.point.x;
        this.jump.destination.y = this._gcAvoidance.point.y;
      }
      this.jump.control.x = _calculateControlPoint(this.jump.origin.x, this.jump.peak.x, this.jump.destination.x);
      this.jump.control.y = _calculateControlPoint(this.jump.origin.y, this.jump.peak.y, this.jump.destination.y);
    },

    _getOffsetPosition(runtime) {
      /* jshint maxcomplexity:13, maxstatements:29 */
      this.tilesetOffset.x = this.movement.facing === DIRECTION.RIGHT
        ? 20
        : 0;
      this.tilesetOffset.y = 0;

      if (!this.movement.moving || this.movement.guided === GUIDED.NARRATIVE) {
        this.tilesetOffset.x = this.tileset.x;
        this.tilesetOffset.y += this.tileset.y;
        return;
      }

      if (this.movement.stunned) {
        this.tilesetOffset.x += 100;
        return;
      }

      if (this.movement.guided === GUIDED.JUMP) {
        if (this.movement.kicking) {
          this.tilesetOffset.x += 40;
        } else if (this.movement.punching) {
          this.tilesetOffset.x += 80;
        }
        this.tilesetOffset.y = 60;
        return;
      }

      // We will be looping through our offset keys for animated walk cycles and things like that.
      if (runtime - 250 > this.tilesetOffset.lastTick) {
        this.tilesetOffset.lastTick = runtime;
        if (++this.tilesetOffset.tick >= 5) {
          this.tilesetOffset.tick = 0;
        }
      }
      this.tilesetOffset.x += this.tilesetOffset.tick * 20;

      if (this.movement.running) {
        this.tilesetOffset.y = 40;
        return;
      }

      if (this.movement.punching) {
        this.tilesetOffset.y = 80;
        return;
      }

      if (this.movement.kicking) {
        this.tilesetOffset.x += 20;
        this.tilesetOffset.y = 100;
      }
    },

    /**
     * Reset the state of a sprite.
     */
    reset() {
      /* jshint maxstatements:29 */
      this.movement.reset();
      this.equipment.leftHand = null;
      this.equipment.rightHand = null;
      this.equipment.head = null;
      this.equipment.boots = null;
      this.equipment.accessories.length = 0;
      this.tileset.src = '/assets/sprite/ryan.gif';
      this.tileset.x = 0;
      this.tileset.y = 0;
      this.speed.x = 5;
      this.speed.y = 5;
      this.x = 0;
      this.y = 0;
      this.height = 30;
      this.width = 30;
      this.jump.control.x = -1;
      this.jump.control.y = -1;
      this.jump.destination.x = -1;
      this.jump.destination.y = -1;
      this.jump.origin.x = -1;
      this.jump.origin.y = -1;
      this.jump.peak.x = -1;
      this.jump.peak.y = -1;
      this.jump.air.width = -1;
      this.jump.air.height = -1;
      this.jump.air.angle = -1;
      this.jump.ground.width = -1;
      this.jump.ground.height = -1;
      this.jump.ground.angle = -1;
      this._gcAvoidance.jumpPoint.x = -1;
      this._gcAvoidance.jumpPoint.y = -1;
      this._gcAvoidance.ellipsePoint.x = -1;
      this._gcAvoidance.ellipsePoint.y = -1;
      this._gcAvoidance.renderingEllipse.angle = -1;
      this._gcAvoidance.renderingEllipse.height = -1;
      this._gcAvoidance.renderingEllipse.width = -1;
      this._gcAvoidance.point.x = -1;
      this._gcAvoidance.point.y = -1;
    }
  }, loadState || {});
  Object.defineProperty(sprite, 'type', _objectType);

  return sprite;
}

/**
 * Calculate the control point for our curve.
 *
 * @param {Number} origin
 * @param {Number} peak
 * @param {Number} destination
 * @returns {Number}
 * @private
 */
function _calculateControlPoint(origin, peak, destination) {
  return (peak / (2 * JUMP_PEAK_REFERENCE * (1 - JUMP_PEAK_REFERENCE)))
    - (origin * JUMP_PEAK_REFERENCE / (2 * (1 - JUMP_PEAK_REFERENCE)))
    - (destination * (1 - JUMP_PEAK_REFERENCE) / (2 * JUMP_PEAK_REFERENCE));
}
