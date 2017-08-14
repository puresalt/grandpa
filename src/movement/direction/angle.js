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

import DIRECTION from '../direction';

const ANGLE = {};
ANGLE[DIRECTION.RIGHT] = 0;
ANGLE[DIRECTION.UP_RIGHT] = 45;
ANGLE[DIRECTION.UP] = 90;
ANGLE[DIRECTION.UP_LEFT] = 135;
ANGLE[DIRECTION.LEFT] = 180;
ANGLE[DIRECTION.DOWN_LEFT] = -135;
ANGLE[DIRECTION.DOWN] = -90;
ANGLE[DIRECTION.DOWN_RIGHT] = -45;

Object.freeze(ANGLE);

export default ANGLE;
