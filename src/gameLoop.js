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

const _ = require('lodash');

export default class GameLoop {

  /**
   *
   * @param {Object} options
   */
  constructor(options) {
    this._paused = false;
    this._delta = 0;
    this._lastRun = 0;

    options = _.defaults(options || {}, {
      fps: 60,
      panicLimit: 240,
      panic: function(gameLoop) {
        gameLoop.pause().resume();
        return true;
      },
      render: function(gameLoop) {
        throw new Error(gameLoop.name + ' is missing a render callback.');
      },
      update: function(delta, gameLoop) {
        throw new Error(gameLoop.name + ' is missing a render callback.', delta);
      }
    });
    this.setFps(options.fps);
    this.setUpdate(options.update);
    this.setRender(options.render);
    this.setPanic(options.panic);
    this.setPanicLimit(options.panicLimit);
  }

  pause() {
    this._paused = true;
    this._lastRun = 0;
    this._delta = 0;
    return this;
  }

  resume() {
    this._paused = false;
    this.run();
    return this;
  }

  run(now) {
    if (this._paused) {
      return;
    }

    // Throttle the frame rate.
    if (now < this._lastRun + this._interval) {
      return requestAnimationFrame(this.run);
    }

    this._delta += now - this._lastRun;
    this._lastRun = now;

    if (this._runUpdate(now)) {
      this._render(this);
    }

    requestAnimationFrame(this.run);
  }

  /**
   * Render updates between game loops. Panic if we hit too many steps.
   *
   * @param {Number} now
   * @returns {Boolean}
   * @private
   */
  _runUpdate(now) {
    let numUpdateSteps = 0;
    while (this._delta >= this._interval) {
      this._update(this._delta, this);
      this._delta -= now;
      numUpdateSteps += 1;
      if (numUpdateSteps >= this._panicLimit) {
        return this._panic(this);
      }
    }
    return true;
  }

  /**
   * Set the FPS for the game loop.
   *
   * @param {Number} fps
   * @returns {GameLoop}
   */
  setFps(fps) {
    this._fps = fps;
    this._interval = 1000 / this._fps;
    return this;
  }

  /**
   * Set the panic limit of steps before panic calls instead of continuing our game loop.
   *
   * @param {Number} panicLimit
   * @returns {GameLoop}
   */
  setPanicLimit(panicLimit) {
    this._panicLimit = panicLimit;
    return this;
  }

  /**
   * Set an update command. Signature is `function(Number: delta, GameLoop: GameLoop);`
   *
   * @param {Function} callback
   * @returns {GameLoop}
   */
  setUpdate(callback) {
    this._update = callback;
    return this;
  }

  /**
   * Set an render command. Signature is `function(GameLoop: GameLoop);`
   *
   * @param {Function} callback
   * @returns {GameLoop}
   */
  setRender(callback) {
    this._render = callback;
    return this;
  }

  /**
   * Set an panic command. Signature is `function(GameLoop: GameLoop);`
   *
   * @param {Function} callback
   * @returns {GameLoop}
   */
  setPanic(callback) {
    this._panic = callback;
    return this;
  }

}
