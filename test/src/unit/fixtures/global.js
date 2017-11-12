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

/* exported _,chai,expect,document,window,stateMachine */

global._ = require('lodash');
global.chai = require('chai');
global.expect = global.chai.expect;

require('jsdom-global')();

const StateMachine = require('../../../../src/vendor/stateMachine');
global.stateMachine = new StateMachine({
  init: 'loading',
  events: [
    {name: 'ready', from: 'loading', to: 'playing'}
  ]
});
