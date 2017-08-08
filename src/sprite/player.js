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

const _renderingEllipse = {
  angle: -1,
  height: -1,
  width: -1
};
const _jumpPoint = {
  x: -1,
  y: -1
};
const _reusedPointObject = {
  x: -1,
  y: -1
};

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
      x: 2,
      y: 3
    },
    tileset: {
      id: 'blank',
      src: '/assets/sprite/ryan.gif',
      x: 3,
      y: 2
    },
    height: 67,
    width: 36,
    standing: 0,

    /**
     * {@inheritDoc}
     */
    update() {
      if (this.movement.jumping) {
        this.detectJumpLocation();
      } else {
        this.detectMovement();
      }
    },

    render(canvas, tileset) {
      baseSprite.render.call(this, canvas, tileset);
      if (this.jump.origin.x !== -1) {
        _jumpPoint.x = this.jump.origin.x;
        _jumpPoint.y = MathUtility.round(this.jump.origin.y - SIZER.relativeSize(this.movement.jumpHeight) - SIZER.relativeSize(this.height));
        _drawEllipse(canvas, _jumpPoint, this.jump.air);
        _drawEllipse(canvas, this.jump.origin, this.jump.ground);

        canvas.beginPath();
        canvas.moveTo(this.jump.origin.x, this.jump.origin.y);
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
  _renderingEllipse.height = ellipse.height;
  _renderingEllipse.width = ellipse.width;
  for (let i = 0; i < 2 * Math.PI; i = i + 0.01) {
    _renderingEllipse.angle = i;
    MathUtility.setPointOnEllipse(origin, _renderingEllipse, _reusedPointObject);
    _reusedPointObject.x = MathUtility.round(_reusedPointObject.x);
    _reusedPointObject.y = MathUtility.round(_reusedPointObject.y);
    if (!i) {
      canvas.moveTo(_reusedPointObject.x, _reusedPointObject.y);
    } else {
      canvas.lineTo(_reusedPointObject.x, _reusedPointObject.y);
    }
  }
  canvas.lineWidth = 2;
  canvas.strokeStyle = '#080';
  canvas.stroke();
  canvas.closePath();

  MathUtility.setPointOnEllipse(origin, ellipse, _reusedPointObject);
  _reusedPointObject.x = MathUtility.round(_reusedPointObject.x);
  _reusedPointObject.y = MathUtility.round(_reusedPointObject.y);
  canvas.beginPath();
  canvas.arc(
    _reusedPointObject.x,
    _reusedPointObject.y,
    SIZER.relativeSize(10),
    SIZER.relativeSize(5),
    0,
    Math.PI * 2,
    true
  );
  canvas.closePath();
  canvas.fill();
}
