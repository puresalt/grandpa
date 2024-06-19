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

/** @module sprite */

'use strict';

import DIRECTION from './movement/direction';
import ANGLE from './movement/direction/angle';
import GUIDED from './movement/guided';
import SIZER from './sizer';
import {UNKNOWN as SPRITE_TYPE} from './sprite/type';
import MathUtility from './math';
import movementFactory from './movement';

const _objectType = {
  configurable: false,
  writeable: false,
  value: SPRITE_TYPE
};
Object.freeze(_objectType);

/**
 * @param {Object=} loadState
 * @returns {module:sprite}
 */
export default function Sprite(loadState) {
  loadState = loadState || {};

  /**
   * Create a sprite.
   *
   * @alias module:sprite
   */
  const sprite = {
    type: _objectType,
    equipment: {
      leftHand: null,
      rightHand: null,
      head: null,
      boots: null,
      accessories: []
    },
    tileset: {
      src: '/asset/sprite/ryan.gif',
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
      y: 5,
      running: 2
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
     * @param {CanvasRenderingContext2D} canvas Canvas tag we will render our sprite onto
     * @param {Object} tileset Tileset to use for drawing
     * @param {Number} runtime When our render was triggered in relation to the start of our game loop
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
        ) - (this.width / 2),
        MathUtility.getPointOnQuadraticCurve(
          this.jump.origin.y,
          this.jump.control.y,
          this.jump.destination.y,
          step
        ) - this.height
      );
      this.movement.jumping = MathUtility.coolDown(this.movement.jumping);
      if (!this.movement.jumping) {
        this.attemptToMoveTo(
          this.jump.destination.x - (this.width) / 2,
          this.jump.destination.y - this.height
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
        ? this.speed.running
        : 1;
      const speedX = this.speed.x * runSpeed;
      const speedY = this.speed.y * runSpeed;
      const movingAbs = Math.abs(this.movement.direction);

      let x = 0;
      let y = 0;
      if (this.movement.direction === ANGLE[DIRECTION.UP]) {
        y -= speedY;
      } else if (this.movement.direction === ANGLE[DIRECTION.RIGHT]) {
        x += speedX;
      } else if (this.movement.direction === ANGLE[DIRECTION.DOWN]) {
        y += speedY;
      } else if (this.movement.direction === ANGLE[DIRECTION.LEFT]) {
        x -= speedX;
      } else {
        if (this.movement.direction > ANGLE[DIRECTION.DOWN] && this.movement.direction < ANGLE[DIRECTION.UP]) {
          x += speedX;
        } else {
          x -= speedX;
        }

        if (this.movement.direction > ANGLE[DIRECTION.RIGHT] && this.movement.direction < ANGLE[DIRECTION.LEFT]) {
          y -= speedY;
        } else {
          y += speedY;
        }

        if (this.movement.direction >= ANGLE[DIRECTION.RIGHT] && this.movement.direction < ANGLE[DIRECTION.UP]) {
          if (this.movement.direction <= ANGLE[DIRECTION.UP_RIGHT]) {
            y *= MathUtility.getTaperedRunningRate(movingAbs, ANGLE[DIRECTION.RIGHT]);
          } else {
            x *= (1 - MathUtility.getTaperedRunningRate(movingAbs, ANGLE[DIRECTION.UP_RIGHT]));
          }
        } else if (this.movement.direction <= ANGLE[DIRECTION.RIGHT] && this.movement.direction >= ANGLE[DIRECTION.DOWN]) {
          if (this.movement.direction >= ANGLE[DIRECTION.DOWN_RIGHT]) {
            y *= MathUtility.getTaperedRunningRate(movingAbs, ANGLE[DIRECTION.RIGHT]);
          } else {
            x *= (1 - MathUtility.getTaperedRunningRate(movingAbs, ANGLE[DIRECTION.UP_RIGHT]));
          }
        } else if (this.movement.direction >= ANGLE[DIRECTION.UP] && this.movement.direction < ANGLE[DIRECTION.LEFT]) {
          if (this.movement.direction >= ANGLE[DIRECTION.UP_LEFT]) {
            y *= (1 - MathUtility.getTaperedRunningRate(movingAbs, ANGLE[DIRECTION.UP_LEFT]));
          } else {
            x *= MathUtility.getTaperedRunningRate(movingAbs, ANGLE[DIRECTION.UP]);
          }
        } else {
          if (this.movement.direction <= ANGLE[DIRECTION.DOWN_LEFT]) {
            y *= (1 - MathUtility.getTaperedRunningRate(movingAbs, ANGLE[DIRECTION.UP_LEFT]));
          } else {
            x *= MathUtility.getTaperedRunningRate(movingAbs, ANGLE[DIRECTION.UP]);
          }
        }
      }

      this.attemptToMoveTo(this.x + x, this.y + y);
    },

    /**
     * Attempt to move a sprite to a given location. Do collision detection or other outside influences.
     *
     * @param {Number} x X coordinate to try and move to
     * @param {Number} y Y coordinate to try and move to
     */
    attemptToMoveTo(x, y) {
      this.x = MathUtility.round(MathUtility.minMax(
        SIZER.relativeSize(x),
        0,
        SIZER.relativeSize(SIZER.width - this.width)
      ));
      this.y = MathUtility.round(MathUtility.minMax(
        SIZER.relativeSize(y),
        this.movement.jumping
          ? SIZER.relativeSize(this.jump.peak.y - this.height)
          : 0,
        SIZER.relativeSize(SIZER.height - this.height)
      ));
    },

    /**
     * Create our jump trajectory in the cases of a good jump.
     *
     * @ignore
     */
    _createJumpTrajectory() {
      const distanceModifier = this.movement.running
        ? 1.25
        : 1;
      const degree = !this.movement.moving
        ? ANGLE[DIRECTION.UP]
        : this.movement.direction;
      const angle = -1 * (degree * Math.PI * 2) / 360;
      this.jump.origin.x = this.x + this.width / 2;
      this.jump.origin.y = this.y + this.height;
      this.jump.air.width = 120 * distanceModifier;
      this.jump.air.height = 30 * distanceModifier;
      this.jump.air.angle = angle;
      this.jump.ground.width = 200 * distanceModifier;
      this.jump.ground.height = 50 * distanceModifier;
      this.jump.ground.angle = angle;

      this._gcAvoidance.ellipsePoint.x = this.x + this.width / 2;
      this._gcAvoidance.ellipsePoint.y = this.y - this.movement.jumpHeight;
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
      this.jump.control.x = MathUtility.getQuadraticCurveControlPoint(this.jump.origin.x, this.jump.peak.x, this.jump.destination.x);
      this.jump.control.y = MathUtility.getQuadraticCurveControlPoint(this.jump.origin.y, this.jump.peak.y, this.jump.destination.y);
    },

    _getOffsetPosition(runtime) {
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
      this.movement.reset();
      this.equipment.leftHand = null;
      this.equipment.rightHand = null;
      this.equipment.head = null;
      this.equipment.boots = null;
      this.equipment.accessories.length = 0;
      this.tileset.src = '/asset/sprite/ryan.gif';
      this.tileset.x = 0;
      this.tileset.y = 0;
      this.speed.x = 5;
      this.speed.y = 5;
      this.speed.running = 2;
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
    },

    ...loadState
  };
  Object.defineProperty(sprite, 'type', _objectType);

  return sprite;
}
