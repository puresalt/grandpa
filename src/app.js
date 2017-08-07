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

/* globals document,window */

'use strict';

import StateMachine from './vendor/stateMachine';
import gameLoopFactory from './gameLoop';
import inputFactory from './input';
import inputStateFactory from './input/state';
import playerFactory from './sprite/player';
import canvasFactory from './canvas';
import npcFactory from './sprite/npc';
import DEBUG from './debug';
import SIZER from './sizer';

(function app() {
  const touchscreen = 'ontouchstart' in document.documentElement;

  const config = {
    element: {
      id: 'app'
    },
    input: {
      type: touchscreen
        ? 'touch'
        : 'keyboard'
    }
  };

  const canvasElement = document.getElementById(config.element.id);
  SIZER.init(canvasElement).update();

  const canvas = canvasFactory(canvasElement);

  const stateMachine = new StateMachine({
    init: 'loading',
    transitions: [
      {name: 'ready', from: 'loading', to: 'menu'}, // initial page loads images and sounds then transitions to 'menu'
      {name: 'start', from: 'menu', to: 'starting'}, // start a new game from the menu
      {name: 'load', from: ['starting', 'playing'], to: 'loading'}, // start loading a new leve
      {name: 'play', from: 'loading', to: 'playing'}, // play the level after loading it
      {name: 'help', from: ['loading', 'playing'], to: 'help'}, // pause the game to show a help topic
      {name: 'resume', from: 'help', to: 'playing'}, // resume playing after showing a help topic
      {name: 'lose', from: 'playing', to: 'lost'}, // player died
      {name: 'quit', from: 'playing', to: 'lost'}, // player quit
      {name: 'win', from: 'playing', to: 'won'}, // player won
      {name: 'finish', from: ['won', 'lost'], to: 'menu'}  // back to menu
    ]
  });

  const player = playerFactory();
  const entities = [
    player,
    npcFactory(),
    npcFactory(),
    npcFactory(),
    npcFactory(),
    npcFactory(),
    npcFactory(),
    npcFactory(),
    npcFactory(),
    npcFactory(),
    npcFactory()
  ];
  const tilesets = entities.reduce((gathered, item) => {
    for (let i = 0, count = gathered.length; i < count; i = i + 1) {
      if (gathered[i].id === item.tileset.id) {
        return gathered;
      }
    }
    gathered.push(item.tileset);
    return gathered;
  }, []);

  canvas.setEntities(entities);
  canvas.setTilesets(tilesets, () => {
    stateMachine.play();
  });

  const inputState = inputStateFactory(player.movement/* , loadState */);
  const debugInput = inputFactory(config.input, inputState, stateMachine);

  const gameLoop = gameLoopFactory({
    render(fps) {
      if (stateMachine.state === 'loading') {
        return;
      }
      canvas.render(fps);
    },
    update(fps) {
      if (stateMachine.state === 'loading') {
        return;
      }
      entities.map(item => {
        item.update(fps, this);
      });
      DEBUG.update(player, debugInput, this);
    }
  });

  DEBUG.init(DEBUG_FLAG);
  if (!document.hidden) {
    gameLoop.start();
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      gameLoop.pause();
    } else {
      gameLoop.start();
    }
  });
  window.addEventListener('focus', () => {
    if (!document.hidden) {
      gameLoop.start();
    }
  });
  window.addEventListener('blur', () => {
    gameLoop.pause();
  });
})();
