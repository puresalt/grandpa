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
import DIRECTION from '../movement/direction';
import MathUtility from '../utility/math';
import baseSpriteFactory from '../sprite';

/**
 * Load our player.
 *
 * @param {Object?} loadState
 */
export default function Npc(loadState) {
  return Object.assign(_.extend(baseSpriteFactory(), {
    hp: 20,
    name: 'NPC',
    tileset: {
      id: 'blank',
      src: '/assets/sprite/ryan.gif',
      x: 47,
      y: 3
    },
    height: 66,
    width: 36,

    /**
     * {@inheritDoc}
     */
    update() {

      if (MathUtility.randomBoolean()) {
        this.movement.moving = MathUtility.randomChoice([
          DIRECTION.UP_RIGHT,
          DIRECTION.UP_LEFT,
          DIRECTION.DOWN_RIGHT,
          DIRECTION.DOWN_LEFT,
          DIRECTION.RIGHT,
          DIRECTION.LEFT,
          DIRECTION.UP,
          DIRECTION.DOWN,
          null
        ]);
      }

      this.detectMovement();
    }
  }), loadState || {});
}
