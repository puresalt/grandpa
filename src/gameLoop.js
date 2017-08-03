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

/* jshint maxstatements:16 */
/* globals requestAnimationFrame */

'use strict';

/**
 * Create our Game Loop. This will delegate rendering based off of state changes.
 *
 * @param {Object?} options
 */
export default function GameLoop(options) {
  let _paused = false;
  let _delta = 0;
  let _lastRun = 0;
  let _lastFpsUpdate = 0;
  let _framesThisSecond = 0;
  let _renderingFps = options.fps || 60;
  let _interval = 1000 / (options.fps || 60);

  const gameLoop = Object.assign(Object.create({
    fps: 60,
    panicLimit: 240,

    /**
     * Damn, something happened and we need to panic!
     *
     * @returns {Boolean}
     */
    panic() {
      this.pause().start();
      return true;
    },

    /**
     * Trigger a canvas rendering.
     */
    render() {
      throw new Error(this.name + ' is missing a render callback.');
    },

    /**
     * Method to trigger anytime an update happens.
     */
    update(fps) {
      throw new Error(this.name + ' is missing a render callback. (' + fps + ')');
    },

    /**
     * Pause our Game Loop.
     *
     * @returns {Object}
     */
    pause() {
      _paused = true;
      _lastFpsUpdate = 0;
      _framesThisSecond = 0;
      return this;
    },

    /**
     * Resume our Game Loop.
     *
     * @returns {Object}
     */
    start() {
      _paused = false;
      requestAnimationFrame(_run);
      return this;
    },

    /**
     * Get our rendering fps.
     *
     * @returns {Number}
     */
    getRenderedFps() {
      return _renderingFps;
    }
  }), options);

  Object.defineProperty(gameLoop, 'fps', {
    set: function(value) {
      this.fps = value;
      _renderingFps = value;
      _interval = 1000 / value;
    }
  });

  /**
   * Run our GameLoop
   *
   * @param {Number} now
   */
  function _run(now) {
    if (_paused) {
      return;
    }
    if (now < _lastRun + _interval) {
      return requestAnimationFrame(_run);
    }
    _delta = _delta + now - _lastRun;
    _lastRun = now;
    _logFps(now);
    if (_runUpdate()) {
      gameLoop.render(gameLoop);
    }
    requestAnimationFrame(_run);
  }

  /**
   * Render updates between game loops. Panic if we hit too many steps.
   *
   * @returns {Boolean}
   * @private
   */
  function _runUpdate() {
    let numUpdateSteps = 0;
    while (_delta >= _interval) {
      gameLoop.update(_renderingFps, gameLoop);
      _delta -= _interval;
      numUpdateSteps = numUpdateSteps + 1;
      if (numUpdateSteps >= gameLoop.panicLimit) {
        return gameLoop.panic(gameLoop);
      }
    }
    return true;
  }

  /**
   * Log our FPS as it runs.
   *
   * @param {Number} now
   * @private
   */
  function _logFps(now) {
    if (now > _lastFpsUpdate + 1000) {
      _renderingFps = 0.25 * _framesThisSecond + 0.75 * _renderingFps;
      _lastFpsUpdate = now;
      _framesThisSecond = 0;
    }
    _framesThisSecond = _framesThisSecond + 1;
  }

  return gameLoop;
}
