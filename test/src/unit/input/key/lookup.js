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

/* jshint expr: true */
/* globals expect */

'use strict';

import {lookup, reverseLookup} from '../../../../../src/input/key/lookup';

describe('InputKeyLookup', () => {
  it('should return a given key for a `keyCode-location`', () => {
    expect(lookup('13-0')).to.equal('RETURN');
    expect(lookup('16-1')).to.equal('SHIFT_LEFT');
    expect(lookup('16-2')).to.equal('SHIFT_RIGHT');
    expect(lookup('32-0')).to.equal('SPACE');
    expect(lookup('27-0')).to.equal('ESC');
    expect(lookup('87-0')).to.equal('W');
    expect(lookup('65-0')).to.equal('A');
    expect(lookup('83-0')).to.equal('S');
    expect(lookup('68-0')).to.equal('D');
  });

  it('should return a given number based on a key input', () => {
    expect(reverseLookup('RETURN')).to.equal('13-0');
    expect(reverseLookup('SHIFT_LEFT')).to.equal('16-1');
    expect(reverseLookup('SHIFT_RIGHT')).to.equal('16-2');
    expect(reverseLookup('SPACE')).to.equal('32-0');
    expect(reverseLookup('ESC')).to.equal('27-0');
    expect(reverseLookup('W')).to.equal('87-0');
    expect(reverseLookup('A')).to.equal('65-0');
    expect(reverseLookup('S')).to.equal('83-0');
    expect(reverseLookup('D')).to.equal('68-0');
  });
});
