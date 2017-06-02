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

/* globals requestAnimationFrame */

'use strict';

import Player from 'player';

(function app() {

  let player = new Player();
  let npcs = [];

  function render(delta) {

    player.render(delta);
    npcs.forEach((npc) => {
      npc.render(delta);
    });

    /** Our main event loop, this is where all state will interact with our canvas */
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
