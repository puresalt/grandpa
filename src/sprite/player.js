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

import SPRITE_TYPE from './type';
import BaseSprite from '../sprite';

const _objectType = {
  configurable: false,
  writeable: false,
  value: SPRITE_TYPE.PLAYER
};
Object.freeze(_objectType);

/**
 * Load our player.
 *
 * @param {Object?} loadState
 */
export default function Player(loadState) {
  const baseSprite = BaseSprite();
  const player = Object.assign({}, baseSprite, {
    hp: 100,
    name: 'Gramps',
    speed: {
      x: 2,
      y: 3
    },
    tileset: {
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
    reset() {
      baseSprite.reset.call(this);
      this.hp = 100;
      this.name = 'Gramps';
      this.speed.x = 2;
      this.speed.y = 3;
      this.tileset.src = '/assets/sprite/ryan.gif';
      this.tileset.x = 3;
      this.tileset.y = 2;
      this.height = 67;
      this.width = 36;
      this.standing = 0;
    }
  }, loadState || {});
  Object.defineProperty(player, 'type', _objectType);

  return player;
}
