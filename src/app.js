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

/* globals document */

'use strict';

import StateMachine from './vendor/stateMachine';
import gameLoopFunction from './gameLoop';
import inputFunction from './input';
import inputStateFunction from './input/state';
import playerFunction from './sprite/player';
import canvasFunction from './canvas';
import npcFunction from './sprite/npc';

const overlay = document.createElement('div');
overlay.style.color = '#fff';
overlay.style.position = 'absolute';
overlay.style.bottom = '10px';
overlay.style.left = '10px';
overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.75);';
overlay.style.zIndex = 100;
document.body.appendChild(overlay);

(function app() {
  const config = {
    element: {
      id: 'app'
    },
    input: {
      type: 'keyboard'
    }
  };
  const canvasElement = document.getElementById(config.element.id);
  const canvas = canvasFunction(canvasElement);

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

  const ready = () => {
    stateMachine.play();
  };

  const player = playerFunction();
  const npcs = [player, npcFunction()];
  const tilesets = npcs.reduce((gathered, item) => {
    for (let i = 0, count = gathered.length; i < count; i = i + 1) {
      if (gathered[i].id === item.tileset.id) {
        return gathered;
      }
    }
    gathered.push(item.tileset);
    return gathered;
  }, []);

  canvas.setEntities(npcs);
  canvas.setTilesets(tilesets, ready);

  const inputState = inputStateFunction(player.movement/* , loadState */);

  inputFunction(config.input, inputState.getEvents(), stateMachine);

  const gameLoop = gameLoopFunction({
    render: (fps) => {
      if (stateMachine.state === 'loading') {
        return;
      }
      canvas.render(fps);
    },
    update: (fps, loop) => {
      if (stateMachine.state === 'loading') {
        return;
      }
      const movement = player.movement;
      player.update(fps, loop);
      overlay.innerHTML = '<pre><strong>FPS:   </strong> ' + loop.getRenderedFps() + '\n<strong>FACING:</strong> ' + movement.facing + '\n<strong>MOVING:</strong> ' + (movement.moving === null ? '<em>null</em>' : movement.moving) + '</pre>';
    }
  });
  gameLoop.start();

})();
