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

import _ from 'lodash/fp';

const DEFAULT_STATE = {
  fps: 60,
  panicLimit: 240,
  panic: (gameLoop) => {
    gameLoop.pause().start();
    return true;
  },
  render: (gameLoop) => {
    throw new Error(gameLoop.name + ' is missing a render callback.');
  },
  update: (fps, gameLoop) => {
    throw new Error(gameLoop.name + ' is missing a render callback. (' + fps + ')');
  }
};

/**
 * Create our Game Loop. This will delegate rendering based off of state changes.
 *
 * @param {Object?} options
 */
export default function GameLoop(options) {
  const gameLoop = _.defaults(_.clone(DEFAULT_STATE), options || {});

  let _paused = false;
  let _delta = 0;
  let _lastRun = 0;
  let _lastFpsUpdate = 0;
  let _framesThisSecond = 0;
  let _renderingFps = gameLoop.fps;
  let _interval = 1000 / gameLoop.fps;

  Object.defineProperty(gameLoop, 'fps', {
    set: function(value) {
      gameLoop.fps = value;
      _renderingFps = value;
      _interval = 1000 / value;
    }
  });

  /**
   * Pause our Game Loop.
   *
   * @returns {Object}
   */
  gameLoop.pause = () => {
    _paused = true;
    _lastRun = 0;
    _delta = 0;
    return gameLoop;
  };

  /**
   * Resume our Game Loop.
   *
   * @returns {Object}
   */
  gameLoop.start = () => {
    _paused = false;
    requestAnimationFrame(_run);
    return gameLoop;
  };

  /**
   * Get the rendered FPS.
   *
   * @returns {Number}
   */
  gameLoop.getRenderedFps = () => {
    return _renderingFps;
  };

  /**
   * Run our GameLoop
   *
   * @param {Number?} now
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
