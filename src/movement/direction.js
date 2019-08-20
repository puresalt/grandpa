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
 * ENUM covering absolute directions.
 *
 * **Movement.DIRECTION:**
 * ```
 * RIGHT
 * UP_RIGHT
 * UP
 * UP_LEFT
 * LEFT
 * DOWN_LEFT
 * DOWN
 * DOWN_RIGHT
 * ```
 *
 * @module movement/direction
 */

'use strict';

const DIRECTION = {
  RIGHT: 'RIGHT',
  UP_RIGHT: 'UP_RIGHT',
  UP: 'UP',
  UP_LEFT: 'UP_LEFT',
  LEFT: 'LEFT',
  DOWN_LEFT: 'DOWN_LEFT',
  DOWN: 'DOWN',
  DOWN_RIGHT: 'DOWN_RIGHT'
};
Object.freeze(DIRECTION);

export default DIRECTION;
