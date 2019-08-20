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
 * Lookup covering absolute directions with their angular value.
 *
 * **Movement.DIRECTION_ANGLE:**
 * ```
 * RIGHT 0
 * UP_RIGHT 45
 * UP 90
 * UP_LEFT 135
 * LEFT 180
 * DOWN_LEFT -135
 * DOWN -90
 * DOWN_RIGHT -45
 * ```
 *
 * @module movement/direction/angle
 */

'use strict';

import DIRECTION from '../direction';

const ANGLE = {
  [DIRECTION.RIGHT]: 0,
  [DIRECTION.UP_RIGHT]: 45,
  [DIRECTION.UP]: 90,
  [DIRECTION.UP_LEFT]: 135,
  [DIRECTION.LEFT]: 180,
  [DIRECTION.DOWN_LEFT]: -135,
  [DIRECTION.DOWN]: -90,
  [DIRECTION.DOWN_RIGHT]: -45
};
Object.freeze(ANGLE);

export default ANGLE;
