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

/* jshint expr:true */
/* globals expect */

'use strict';

import Sprite from '../../../src/sprite/npc';
import SIZER from '../../../src/sizer';

describe('Sprite', () => {
  describe('movement', () => {
    it('should allow us to move within our restraints', () => {
      const sprite = Sprite();
      expect(sprite.x).to.equal(0);
      expect(sprite.y).to.equal(0);
      sprite.attemptToMoveTo(5, 3);
      expect(sprite.x).to.equal(5);
      expect(sprite.y).to.equal(3);
      sprite.attemptToMoveTo(SIZER.width + 100000, -1);
      expect(sprite.x).to.be.below(SIZER.width);
      expect(sprite.y).to.equal(0);
      sprite.attemptToMoveTo(-1, SIZER.height + 100000);
      expect(sprite.x).to.equal(0);
      expect(sprite.y).to.be.below(SIZER.width);
    });
  });

  describe('reset should match the signature', () => {
    const sprite = Sprite();
    const originalName = sprite.name;
    sprite.name = sprite.name + ' New Name';
    expect(sprite.name).to.not.equal(originalName);
    sprite.reset();
    expect(sprite.name).to.equal(originalName);
  });
});
