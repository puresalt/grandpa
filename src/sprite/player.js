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
import MathUtility from '../utility/math';

/**
 * Load our player.
 *
 * @param {Object?} loadState
 */
export default function Player(loadState) {
  return Object.assign(_.extend(baseSpriteFactory(), {
    hp: 100,
    name: 'Gramps',
    speed: {
      x: 5,
      y: 5
    },
    tileset: {
      id: 'blank',
      src: '/assets/sprite/ryan.gif',
      height: 30,
      width: 30,
      x: 0,
      y: 0
    },
    update() {
      if (this.movement.jumping) {
        this.movement.jumping = MathUtility.coolDown(this.movement.jumping);
      }
      this.detectMovement();
    }
  }), loadState || {});
}
