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

/* jshint expr:true */
/* globals describe,expect,it */

'use strict';

import sinon from 'sinon';
import EVENT from '../../../src/event';
import PubSub from '../../../src/pubSub';

describe('PubSub', () => {
  describe('singleton', () => {
    it('should only be equal to itself', () => {
      const pubSubSingleton = PubSub.singleton();
      expect(pubSubSingleton).to.equal(PubSub.singleton());
      expect(pubSubSingleton).to.not.equal(PubSub.instance());
    });
  });

  describe('instance', () => {
    it('should be able to subscribe and trigger an event', () => {
      const callback = sinon.spy();
      const pubSub = PubSub.instance();
      pubSub.subscribe(EVENT.RELEASE, callback);
      expect(callback.notCalled).to.be.true;
      pubSub.publish(EVENT.RELEASE, 'ok!');
      expect(callback.calledOnce).to.be.true;
      expect(callback.calledWith('ok!')).to.be.true;
      pubSub.unsubscribe(EVENT.RELEASE, callback);
      pubSub.publish(EVENT.RELEASE, 'ok!');
      expect(callback.calledOnce).to.be.true;
    });

    it('should be able to unsubscribe with the return method', () => {
      const callback = sinon.spy();
      const pubSub = PubSub.instance();
      const event = pubSub.subscribe(EVENT.RELEASE, callback);
      event.unsubscribe();
      pubSub.publish(EVENT.RELEASE);
      expect(callback.notCalled).to.be.true;
    });

    it('should be able to clear all events', () => {
      const callback = sinon.spy();
      const pubSub = PubSub.instance();
      pubSub.subscribe(EVENT.RELEASE, callback);
      pubSub.clear();
      pubSub.publish(EVENT.RELEASE);
      expect(callback.notCalled).to.be.true;
    });

    it('should be able to clear specific events', () => {
      const callback = sinon.spy();
      const pubSub = PubSub.instance();
      pubSub.subscribe(EVENT.RELEASE, callback);
      pubSub.subscribe(EVENT.PRESS, callback);
      pubSub.clear(EVENT.RELEASE);
      pubSub.publish(EVENT.RELEASE);
      expect(callback.notCalled).to.be.true;
      pubSub.publish(EVENT.PRESS);
      expect(callback.calledOnce).to.be.true;
    });
  });
});
