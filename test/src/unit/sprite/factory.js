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

/* jshint expr: true */
/* globals expect */

'use strict';

import PlayerFactory from '../../../../src/sprite/player';
import NpcFactory from '../../../../src/sprite/npc';
import SpriteFactory from '../../../../src/sprite/factory';

const playerComparison = PlayerFactory();
const npcComparison = NpcFactory();

describe('SpriteFactory', () => {
  describe('create', () => {
    it('should return a player', () => {
      const spriteFactory = SpriteFactory();
      const playerCreated = spriteFactory.create('player');
      expect(playerCreated.constructor).to.equal(playerComparison.constructor);
      expect(JSON.stringify(playerCreated)).to.equal(JSON.stringify(playerComparison));
      expect(spriteFactory.all().length).to.equal(1);
    });

    it('should return an npc', () => {
      const spriteFactory = SpriteFactory();
      const npcCreated = spriteFactory.create('npc');
      expect(npcCreated.constructor).to.equal(npcComparison.constructor);
      expect(JSON.stringify(npcCreated)).to.equal(JSON.stringify(npcComparison));
      expect(spriteFactory.all().length).to.equal(1);
    });

    it('should return an npc with loadState', () => {
      const spriteFactory = SpriteFactory();
      const npcCreated = spriteFactory.create('npc');
      expect(npcCreated.constructor).to.equal(npcComparison.constructor);
      expect(JSON.stringify(npcCreated)).to.equal(JSON.stringify(npcComparison));
      expect(spriteFactory.all().length).to.equal(1);
    });

    it('all should have 2 sprites', () => {
      const spriteFactory = SpriteFactory();
      spriteFactory.create('npc');
      spriteFactory.create('player');
      expect(spriteFactory.all().length).to.equal(2);
    });

    it('remove a sprite', () => {
      const spriteFactory = SpriteFactory();
      const playerCreated = spriteFactory.create('player');
      const npcCreated = spriteFactory.create('npc');
      expect(spriteFactory.all().length).to.equal(2);
      spriteFactory.remove(playerCreated);
      const all = spriteFactory.all();
      expect(all.length).to.equal(1);
      expect(all).to.include(npcCreated);
      expect(all).to.not.include(playerCreated);
    });

    it('reuse a sprite', () => {
      const spriteFactory = SpriteFactory();
      const playerCreated = spriteFactory.create('player');
      const defaultName = playerCreated.name;
      playerCreated.name = playerCreated.name + ' New Name';
      spriteFactory.remove(playerCreated);
      const playerRecreated = spriteFactory.create('player');
      expect(playerCreated).to.equal(playerRecreated);
      expect(playerCreated.name).to.equal(defaultName);
      const anotherPlayer = spriteFactory.create('player');
      expect(playerCreated).to.not.equal(anotherPlayer);
    });

    it('cremate all used sprites and create anew', () => {
      const spriteFactory = SpriteFactory();
      const playerCreated = spriteFactory.create('player');
      spriteFactory.remove(playerCreated);
      spriteFactory.cremate();
      const playerRecreated = spriteFactory.create('player');
      expect(playerCreated).to.not.equal(playerRecreated);
    });
  });
});
