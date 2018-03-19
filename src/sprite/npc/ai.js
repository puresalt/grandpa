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

import _ from 'lodash';

const _objectType = {
  configurable: false,
  writeable: false,
  value: 'ai'
};

/**
 * Return NPC AI.
 *
 * @param {Object?} loadState
 */
export default function Ai(loadState) {
  const ai = _.merge({
    update() {

    }
  }, loadState || {});
  Object.defineProperty(ai, 'type', _objectType);

  return ai;
}
