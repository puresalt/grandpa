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

/** @module sprite/player */

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
 * Create a player for our game. For a single player game there should only be one of these created per game.
 *
 * @param {Object=} loadState Default data to create a Player sprite with
 * @alias module:sprite/player Our created Player sprite with its appropriate data loaded
 * @alias module:sprite/player
 * @extends module:sprite
 */
export default function Player(loadState) {
  loadState = loadState || {};
  const baseSprite = BaseSprite();

  /** @alias module:sprite/player */
  const player = {
    ...baseSprite,

    hp: 100,
    name: 'Gramps',
    speed: {
      x: 2,
      y: 3,
      running: 2
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
      this.speed.running = 2;
      this.tileset.src = '/assets/sprite/ryan.gif';
      this.tileset.x = 3;
      this.tileset.y = 2;
      this.height = 67;
      this.width = 36;
      this.standing = 0;
    },

    ...loadState
  };
  Object.defineProperty(player, 'type', _objectType);

  return player;
}
