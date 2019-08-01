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
import playerFactory from './player';
import npcFactory from './npc';

const _spriteTypes = {};
_spriteTypes[SPRITE_TYPE.PLAYER] = playerFactory;
_spriteTypes[SPRITE_TYPE.NPC] = npcFactory;
Object.freeze(_spriteTypes);

/**
 * Keep track of all dead/alive sprites.
 *
 * @returns {{
 *   all: function(),
 *   create: function(type: String, loadData: Object=),
 *   cremate: function(),
 *   remove: function(Object)
 * }}
 */
export default function spriteFactory() {
  const _alive = [];
  const _graveyard = {};

  for (const key in _spriteTypes) {
    /* istanbul ignore if */
    if (!_spriteTypes.hasOwnProperty(key)) {
      continue;
    }
    _graveyard[key] = [];
  }

  const methods = {
    /**
     * Get all alive sprites in their expected direction.
     *
     * @returns {Array}
     */
    all() {
      return _alive.sort(spriteFactory.sort);
    },

    /**
     * Set all of the entities for our canvas.
     *
     * @param {String} type
     * @param {Object?} loadData
     * @returns {Object}
     */
    create(type, loadData) {
      let sprite = _graveyard[type].length
        ? _graveyard[type].shift()
        : _spriteTypes[type]();
      sprite.reset();
      sprite = Object.assign(sprite, loadData || {});
      _alive.push(sprite);
      return sprite;
    },

    /**
     * Remove all of the items from our graveyard.
     */
    cremate() {
      for (const key in _spriteTypes) {
        /* istanbul ignore if */
        if (!_spriteTypes.hasOwnProperty(key)) {
          continue;
        }
        _graveyard[key] = [];
      }
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
    }
  };
  Object.freeze(methods);

  return methods;
}

/**
 * Sort two entities by their y and then x coordinates.
 *
 * @param {{x: Number, y: Number}} entity1
 * @param {{x: Number, y: Number}} entity2
 * @returns {Number}
 */
spriteFactory.sort = function(entity1, entity2) {
  /* jshint maxcomplexity:5 */
  if (entity1.x > entity2.x) {
    return 1;
  }

  if (entity1.x < entity2.x) {
    return -1;
  }

  if (entity1.y > entity2.y) {
    return 1;
  }

  if (entity1.y < entity2.y) {
    return -1;
  }

  return 0;
};
