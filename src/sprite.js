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

'use strict';

import _ from 'lodash/fp';

const DEFAULT_STATE = {
  x: 0,
  y: 0,
  height: 0,
  width: 0
};

export default function Sprite(loadState, extendedDefaultState) {
  const _defaultState = _.defaults(_.cloneDeep(DEFAULT_STATE), _.cloneDeep(extendedDefaultState));
  const _state = _.defaults(_defaultState, loadState);

  /**
   * Render our sprite.
   *
   * @param delta
   */
  _state.render = (delta) => {
    throw new ReferenceError(_state.constructor.name + ' is missing a `render` definition. (' + parseInt(delta) + ')');
  };

  /**
   * Trigger an update.
   *
   * @param {Number} delta
   * @param {GameLoop} gameLoop
   */
  _state.update = (delta, gameLoop) => {
    throw new ReferenceError(_state.constructor.name + ' is missing an `update` definition. (' + parseInt(delta) + ', ' + gameLoop + ')');
  };

  return _state;
}
