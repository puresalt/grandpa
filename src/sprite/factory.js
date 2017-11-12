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

import _ from 'lodash';
import playerFactory from './player';
import npcFactory from './npc';

const _spriteTypes = {
  player: playerFactory,
  npc: npcFactory
};

/**
 * Keep track of all dead/alive sprites.
 *
 * @returns {Object}
 */
export default function spriteFactory() {
  const _alive = [];
  const _graveyard = {};

  for (let key in _spriteTypes) {
    /* istanbul ignore if */
    if (!_spriteTypes.hasOwnProperty(key)) {
      continue;
    }
    _graveyard[key] = [];
  }

  const methods = {
    /**
     * Set all of the entities for our canvas.
     *
     * @param {String} type
     * @param {Object?} data
     * @returns {Object}
     */
    create(type, data) {
      let sprite;
      if (_graveyard[type].length) {
        sprite = _graveyard[type].shift();
        sprite.reset();
        sprite = _.merge(sprite, data || {});
      } else {
        sprite = _.merge(_spriteTypes[type](), data || {});
      }
      _alive.push(sprite);
      return sprite;
    },

    /**
     * Remove a specific sprite.
     *
     * @param {Object} sprite
     * @returns {Object}
     */
    remove(sprite) {
      for (let i = 0, count = _alive.length; i < count; ++i) {
        /* istanbul ignore if */
        if (sprite !== _alive[i]) {
          continue;
        }
        _graveyard[sprite.type].push(_alive[i]);
        _alive.splice(i, 1);
      }
    },

    /**
     * Get all alive sprites in their expected direction.
     *
     * @returns {Array}
     */
    all() {
      return _alive.sort(_sortByY);
    },

    /**
     * Remove all of the items from our graveyard.
     */
    cremate() {
      for (let key in _spriteTypes) {
        /* istanbul ignore if */
        if (!_spriteTypes.hasOwnProperty(key)) {
          continue;
        }
        _graveyard[key] = [];
      }
    }
  };

  return Object.freeze(methods);
}

/**
 * Sort two entities by their y and then x coordinates.
 *
 * @param {{x: Number, y: Number}} entity1
 * @param {{x: Number, y: Number}} entity2
 * @returns {Boolean}
 * @private
 */
function _sortByY(entity1, entity2) {
  return entity1.x > entity2.x || (entity1.x === entity2.x && entity1.y > entity2.y);
}
