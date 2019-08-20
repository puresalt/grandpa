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

/* global describe, it, expect */

'use strict';

const helper = require('../../../server/helper');

describe('Helper', () => {
  it('generateId should return a bigint string starting with i', () => {
    expect(helper.generateId()).to.be.a('string');
    expect(helper.generateId()).to.be.length(20);
    expect(helper.generateId().charAt(0)).to.equal('i');
  });
});
