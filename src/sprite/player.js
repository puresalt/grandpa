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
  hp: 100,
  name: 'Gramps',
  speed: {
    x: 10,
    y: 10
  },
  tileset: {
    id: 'blank',
    src: '/assets/sprite/ryan.gif',
    height: 30,
    width: 30,
    x: 0,
    y: 0
  }
};

const canvas = document.getElementById('app');

/**
 * Load our player.
 *
 * @param {Object?} loadState
 */
export default function Player(loadState) {
  const _sprite = baseSprite(loadState || {}, _.cloneDeep(DEFAULT_STATE));
  _sprite.movement = movement();

  const maxX = canvas.clientWidth - _sprite.width;
  const maxY = canvas.clientHeight - _sprite.height;

  _sprite.update = (_baseUpdate => {
    return (fps, gameLoop) => {
      const movement = _sprite.movement;
      let x = _sprite.x;
      let y = _sprite.y;
      switch (movement.moving) {
        case DIRECTION.UP_RIGHT:
          x = _sprite.x + _sprite.speed.x;
          y = _sprite.y - _sprite.speed.y;
          break;
        case DIRECTION.UP_LEFT:
          x = _sprite.x - _sprite.speed.x;
          y = _sprite.y - _sprite.speed.y;
          break;
        case DIRECTION.DOWN_RIGHT:
          x = _sprite.x + _sprite.speed.x;
          y = _sprite.y + _sprite.speed.y;
          break;
        case DIRECTION.DOWN_LEFT:
          x = _sprite.x - _sprite.speed.x;
          y = _sprite.y + _sprite.speed.y;
          break;
        case DIRECTION.RIGHT:
          x = _sprite.x + _sprite.speed.x;
          break;
        case DIRECTION.LEFT:
          x = _sprite.x - _sprite.speed.x;
          break;
        case DIRECTION.UP:
          y = _sprite.y - _sprite.speed.y;
          break;
        case DIRECTION.DOWN:
          y = _sprite.y + _sprite.speed.y;
          break;
      }
      _sprite.x = MathUtility.minMax(0, x, maxX);
      _sprite.y = MathUtility.minMax(0, y, maxY);
    };
  })(_sprite.update);

  return _sprite;
}
