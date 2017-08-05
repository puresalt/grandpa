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
import baseSpriteFactory from '../sprite';
import SIZER from '../sizer';
import MathUtility from '../utility/math';

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
        this.movement.jumping = MathUtility.coolDown(this.movement.jumping);
      } else {
        this.detectMovement();
      }
    },

    render(canvas, tileset) {
      baseSprite.render.call(this, canvas, tileset);
      if (this.movement.jumping) {
        _drawEllipse(canvas, Math.round(this.x + (SIZER.relativeSize(this.width) / 2)), Math.round(this.y - SIZER.relativeSize(this.movement.jumpHeight)), 80, 20, this.movement.moving);
        _drawEllipse(canvas, Math.round(this.x + (SIZER.relativeSize(this.width) / 2)), Math.round(this.y + SIZER.relativeSize(this.height)), 200, 50, this.movement.moving);
      }
    }
  }), loadState || {});

  return player;
}

/**
 * Draw an ellipse on a canvas based off of the sizing.
 *
 * @param {CanvasRenderingContext2D} canvas
 * @param {Number} centerX
 * @param {Number} centerY
 * @param {Number} width
 * @param {Number} height
 * @param {Number} degree
 * @private
 */
function _drawEllipse(canvas, centerX, centerY, width, height, degree) {
  canvas.beginPath();
  for (let i = 0; i < 2 * Math.PI; i = i + 0.01) {
    const pointX = centerX - (height * Math.sin(i)) * Math.sin(0) + (width * Math.cos(i)) * Math.cos(0);
    const pointY = centerY + (width * Math.cos(i)) * Math.sin(0) + (height * Math.sin(i)) * Math.cos(0);
    if (!i) {
      canvas.moveTo(pointX, pointY);
    } else {
      canvas.lineTo(pointX, pointY);
    }
  }
  canvas.lineWidth = 2;
  canvas.strokeStyle = '#080';
  canvas.stroke();
  canvas.closePath();
  if (degree < 0) {
    degree = 360 + degree;
  }
  const angle = -1 * (degree * Math.PI * 2) / 360;
  const landingX = centerX - (height * Math.sin(angle)) * Math.sin(0) + (width * Math.cos(angle)) * Math.cos(0);
  const landingY = centerY + (width * Math.cos(angle)) * Math.sin(0) + (height * Math.sin(angle)) * Math.cos(0);
  canvas.beginPath();
  canvas.arc(
    landingX,
    landingY,
    SIZER.relativeSize(10),
    SIZER.relativeSize(5),
    0,
    Math.PI * 2,
    true
  );
  canvas.closePath();
  canvas.fill();
}