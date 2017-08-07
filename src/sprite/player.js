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

import _ from 'lodash/fp';
import SIZER from '../sizer';
import baseSpriteFactory from '../sprite';
import MathUtility from '../math';

/**
 * Load our player.
 *
 * @param {Object?} loadState
 */
export default function Player(loadState) {
  const baseSprite = baseSpriteFactory();

  const player = Object.assign(_.extend(baseSprite, {
    hp: 100,
    name: 'Gramps',
    speed: {
      x: 5,
      y: 5
    },
    tileset: {
      id: 'blank',
      src: '/assets/sprite/ryan.gif',
      x: 3,
      y: 2
    },
    velocity: {
      x: 0,
      y: 0,
      maxX: 40,
      maxY: 30000
    },
    height: 67,
    width: 36,
    standing: 0,

    /**
     * {@inheritDoc}
     */
    update(fps) {
      if (this.movement.jumping) {
        this.detectJumpLocation();
      } else {
        this.detectMovement();
      }
    },

    render(canvas, tileset) {
      baseSprite.render.call(this, canvas, tileset);
      if (this.jump !== null) {
        _drawEllipse(canvas, {
          x: Math.round(this.jump.origin.x + (SIZER.relativeSize(this.width) / 2)),
          y: Math.round(this.jump.origin.y - SIZER.relativeSize(this.movement.jumpHeight))
        }, this.jump.air);
        _drawEllipse(canvas, {
          x: Math.round(this.jump.origin.x + (SIZER.relativeSize(this.width) / 2)),
          y: Math.round(this.jump.origin.y + SIZER.relativeSize(this.height))
        }, this.jump.ground);

        canvas.beginPath();
        canvas.moveTo(Math.round(this.jump.origin.x + (SIZER.relativeSize(this.width) / 2)), Math.round(this.jump.origin.y + SIZER.relativeSize(this.height)));
        canvas.quadraticCurveTo(this.jump.control.x, this.jump.control.y, this.jump.destination.x, this.jump.destination.y);
        canvas.stroke();
        canvas.closePath();
        canvas.beginPath();
        canvas.arc(
          this.jump.control.x,
          this.jump.control.y,
          SIZER.relativeSize(10),
          SIZER.relativeSize(5),
          0,
          Math.PI * 2,
          true
        );
        canvas.closePath();
        canvas.fill();

      }
    }
  }), loadState || {});

  return player;
}

/**
 * Draw an ellipse on a canvas based off of the sizing.
 *
 * @param {CanvasRenderingContext2D} canvas
 * @param {{x: Number, y: Number}} origin
 * @param {{angle: Number, height: Number, width: Number}} ellipse
 * @private
 */
function _drawEllipse(canvas, origin, ellipse) {
  canvas.beginPath();
  const renderingEllipse = {angle: 0, height: ellipse.height, width: ellipse.width};
  for (let i = 0; i < 2 * Math.PI; i = i + 0.01) {
    renderingEllipse.angle = i;
    const point = MathUtility.getPointOnEllipse(origin, renderingEllipse);
    if (!i) {
      canvas.moveTo(point.x, point.y);
    } else {
      canvas.lineTo(point.x, point.y);
    }
  }
  canvas.lineWidth = 2;
  canvas.strokeStyle = '#080';
  canvas.stroke();
  canvas.closePath();

  const landing = MathUtility.getPointOnEllipse(origin, ellipse);
  canvas.beginPath();
  canvas.arc(
    landing.x,
    landing.y,
    SIZER.relativeSize(10),
    SIZER.relativeSize(5),
    0,
    Math.PI * 2,
    true
  );
  canvas.closePath();
  canvas.fill();
}
