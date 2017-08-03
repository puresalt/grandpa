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
import baseSprite from '../sprite';
import movement from '../movement';

const DEFAULT_STATE = {
  equipment: {
    leftHand: null,
    rightHand: null,
    head: null,
    boots: null,
    accessories: []
  },
  hp: 20,
  name: 'NPC',
  tileset: {
    id: 'blank',
    src: '/assets/sprite/ryan.gif',
    height: 30,
    width: 30,
    x: 0,
    y: 0
  }
};

/**
 * Load our player.
 *
 * @param {Object?} loadState
 */
export default function Npc(loadState) {
  const _sprite = baseSprite(loadState || {}, _.cloneDeep(DEFAULT_STATE));
  _sprite.movement = movement();

  _sprite.update = (_baseUpdate => {
    return (fps, gameLoop) => {
      _baseUpdate(fps, gameLoop);
    };
  })(_sprite.update);

  return _sprite;
}
