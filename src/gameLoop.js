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

/**
 * Create our Game Loop. This will keep all elements in sync with each other and is a wrapper around the event loop.
 *
 * @module gameLoop
 */

/* eslint no-console: off */

'use strict';

/**
 * @param {Object=} options
 */
export default function GameLoop(options) {
  options = options || {};

  let _paused = null;
  let _delta = 0;
  let _lastRun = 0;
  let _runtime = 0;
  let _lastFpsUpdate = 0;
  let _framesThisSecond = 0;
  let _renderingFps = options.fps || 60;
  let _interval = 1000 / (options.fps || 60);

  /** @alias module:gameLoop */
  const gameLoop = {
    fps: 60,
    panicLimit: 240,

    /**
     * Damn, something happened and we need to panic!
     */
    panic() {
      console.error('PANIC!');
      this.pause();
      setTimeout(() => {
        this.start();
      }, 0);
    },

    /**
     * Trigger a canvas rendering.
     *
     * @param {Number} runtime When our render was triggered in relation to the start of our game loop
     */
    render(runtime) {
      throw new Error(`gameLoop is missing a render callback. [${runtime}]`);
    },

    /**
     * Method to trigger anytime an update happens.
     *
     * @param {Number} runtime When our render was triggered in relation to the start of our game loop
     * @param {Number} fps FPS we hit last loop
     */
    update(fps, runtime) {
      throw new Error(`gameLoop is missing a render callback. (${fps}, ${runtime})`);
    },

    /**
     * Pause our Game Loop.
     */
    pause() {
      if (_paused === true) {
        return;
      }
      console.log('gameLoop.pause');
      _paused = true;
      _lastFpsUpdate = 0;
      _framesThisSecond = 0;
    },

    /**
     * Resume our Game Loop.
     */
    start() {
      if (_paused === false) {
        return;
      }
      console.log('gameLoop.start');
      _delta = 0;
      _lastRun = window.performance.now();
      _runtime = _lastRun;
      _paused = false;
      requestAnimationFrame(_run);
    },

    /**
     * Get our rendering fps.
     *
     * @returns {Number} FPS we hit last loop
     */
    getRenderedFps() {
      return _renderingFps;
    },

    ...options
  };

  Object.defineProperty(gameLoop, 'fps', {
    set: (value) => {
      this.fps = value;
      _renderingFps = value;
      _interval = 1000 / value;
    }
  });

  /**
   * Run our GameLoop
   *
   * @param {Number} now
   * @private
   * @ignore
   */
  function _run(now) {
    _runtime = window.performance.now();
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
      gameLoop.render(_runtime);
    }
    requestAnimationFrame(_run);
  }

  /**
   * Render updates between game loops. Panic if we hit too many steps.
   *
   * @returns {Boolean}
   * @private
   * @ignore
   */
  function _runUpdate() {
    let numUpdateSteps = 0;
    while (_delta >= _interval) {
      gameLoop.update(_runtime, _renderingFps);
      _delta -= _interval;
      numUpdateSteps = numUpdateSteps + 1;
      if (numUpdateSteps >= gameLoop.panicLimit) {
        return gameLoop.panic();
      }
    }
    return true;
  }

  /**
   * Log our FPS as it runs.
   *
   * @param {Number} now
   * @private
   * @ignore
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
