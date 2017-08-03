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
const canvas = document.getElementById('app');

import DIRECTION from './movement/direction';
import MathUtility from './utility/math';
import movementFactory from './movement';

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
      height: 30,
      width: 30,
      x: 0,
      y: 0
    },
    speed: {
      x: 5,
      y: 5
    },
    height: 60,
    width: 60,
    x: 0,
    y: 0,
    update() {

    },
    movement: movementFactory(),
    detectMovement() {
      const movement = this.movement;

      if (movement.stunned) {
        return;
      }

      const maxX = canvas.width - this.width;
      const maxY = canvas.height - this.height;

      let x = this.x;
      let y = this.y;

      let speedX = this.speed.x;
      let speedY = this.speed.y;
      if (movement.running) {
        speedX = Math.round(speedX * 1.75);
        speedY = Math.round(speedY * 1.75);
      }

      switch (movement.moving) {
        case DIRECTION.UP_RIGHT:
          x = x + speedX;
          y = y - speedY;
          break;
        case DIRECTION.UP_LEFT:
          x = x - speedX;
          y = y - speedY;
          break;
        case DIRECTION.DOWN_RIGHT:
          x = x + speedX;
          y = y + speedY;
          break;
        case DIRECTION.DOWN_LEFT:
          x = x - speedX;
          y = y + speedY;
          break;
        case DIRECTION.RIGHT:
          x = x + speedX;
          break;
        case DIRECTION.LEFT:
          x = x - speedX;
          break;
        case DIRECTION.UP:
          y = y - speedY;
          break;
        case DIRECTION.DOWN:
          y = y + speedY;
          break;
      }

      this.x = MathUtility.minMax(x, 0, maxX);
      this.y = MathUtility.minMax(y, 0, maxY);
    }
  }, loadState || {}));
}
