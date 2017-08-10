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
import GameLoop from './gameLoop';
import InputFactory from './input/factory';
import InputState from './input/state';
import Canvas from './canvas';
import SpriteFactory from './sprite/factory';
import Debug from './debug';
import Sizer from './sizer';

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
  Sizer.init(canvasElement).update();
  const canvas = Canvas(canvasElement);

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

  const spriteFactory = SpriteFactory();
  const player = spriteFactory.create('player');
  const entities = [
    player,
    spriteFactory.create('npc')
  ];
  const tilesets = entities.reduce((gathered, item) => {
    for (let i = 0, count = gathered.length; i < count; ++i) {
      if (gathered[i].src === item.tileset.src) {
        return gathered;
      }
    }
    gathered.push(item.tileset);
    return gathered;
  }, []);

  entities.forEach(item => {
    canvas.addEntity(item);
  });

  canvas.loadTilesets(tilesets, () => {
    stateMachine.play();
  });

  const inputState = InputState(player.movement/* , loadState */);
  const debugInput = InputFactory(config.input, inputState, stateMachine);

  const gameLoop = GameLoop({
    render() {
      if (stateMachine.state === 'loading') {
        return;
      }
      canvas.render();
    },
    update() {
      if (stateMachine.state === 'loading') {
        return;
      }
      for (let i = 0, count = entities.length; i < count; ++i) {
        entities[i].update();
      }
      Debug.update(player, debugInput, this);
    }
  });

  Debug.init(DEBUG_FLAG);
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
