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

/** @module sprite/npc */

'use strict';

import {NPC as SPRITE_TYPE} from './type';
import MathUtility from '../math';
import BaseSprite from '../sprite';

const _objectType = {
  configurable: false,
  writeable: false,
  value: SPRITE_TYPE
};
Object.freeze(_objectType);

/**
 * Load an NPC.
 *
 * @param {Object=} loadState Default data to create an NPC sprite with
 * @returns module:sprite/npc Our created NPC sprite with its appropriate data loaded
 * @alias module:sprite/npc
 * @extends module:sprite
 */
export default function Npc(loadState) {
  loadState = loadState || {};
  const baseSprite = BaseSprite();

  /** @alias module:sprite/npc */
  const npc = {
    ...baseSprite,

    hp: 20,
    name: 'Larsson',
    tileset: {
      src: '/asset/sprite/ryan.gif',
      x: 47,
      y: 3
    },
    height: 66,
    width: 36,

    /**
     * {@inheritDoc}
     */
    update() {
      /* istanbul ignore next */
      if (MathUtility.randomBoolean()) {
        if (MathUtility.randomNumber(0, 10) <= 2) {
          this.movement.move(MathUtility.randomNumber(-180, 180));
        }
        if (MathUtility.randomNumber(0, 10) === 1) {
          this.movement.jump(true);
        }
      }
      /* istanbul ignore next */
      baseSprite.update.call(this, null);
    },

    /**
     * {@inheritDoc}
     */
    reset() {
      baseSprite.reset.call(this);
      this.hp = 20;
      this.name = 'Larsson';
      this.tileset.src = '/asset/sprite/ryan.gif';
      this.tileset.x = 47;
      this.tileset.y = 3;
      this.height = 66;
      this.width = 36;
    },

    ...loadState
  };
  Object.defineProperty(npc, 'type', _objectType);

  return npc;
}
