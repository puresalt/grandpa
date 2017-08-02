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

/* globals describe,it,expect */

'use strict';

const STATE = require('../../../server/state');

describe('State', () => {

  describe('get', () => {
    it('should be false if the object doesn\'t exist', () => {
      const state = STATE();
      const id = 123;

      expect(state.get(id)).to.be.false;
    });

    it('should return an object if it exists', () => {
      const state = STATE();
      const id = 123;
      const data = {a: 1};

      state.save(id, data);
      expect(state.get(id).a).to.be.equal(1);
    });
  });

  describe('has', () => {
    it('should be false if the object doesn\'t exist', () => {
      const state = STATE();
      const id = 123;

      expect(state.has(id)).to.be.false;
    });

    it('should return true if an object exists', () => {
      const state = STATE();
      const id = 123;
      const data = {a: 1};

      state.save(id, data);
      expect(state.has(id)).to.be.true;
    });
  });

  describe('save', () => {
    it('should create an object', () => {
      const state = STATE();
      const id = 123;
      const data = {a: 1};

      state.save(id, data);
      expect(state.get(id).a).to.be.equal(1);
    });

    it('should overwrite a value', () => {
      const state = STATE();
      const id = 123;
      const data = {a: 1};

      state.save(id, data);
      state.save(id, {a: 2});
      expect(state.get(id).a).to.be.equal(2);
    });

    it('should add a value', () => {
      const state = STATE();
      const id = 123;
      const data = {a: 1};

      state.save(id, data);
      state.save(id, {b: 2});
      expect(state.get(id).a).to.be.equal(1);
      expect(state.get(id).b).to.be.equal(2);
    });
  });

  describe('replace', () => {
    it('should overwrite an object', () => {
      const state = STATE();
      const id = 123;
      const data = {a: 1};

      state.save(id, data);
      const replaced = state.replace(id, {b: 3});
      expect(replaced).to.be.true;
      expect(state.get(id).a).to.not.exist;
      expect(state.get(id).b).to.be.equal(3);
    });

    it('should overwrite a value', () => {
      const state = STATE();
      const id = 123;

      const replaced = state.replace(id, {c: 3});
      expect(replaced).to.be.false;
    });
  });

  describe('remove', () => {
    it('should remove an entire object if data isn\'t provided', () => {
      const state = STATE();
      const id = 123;
      const data = {a: 1};

      state.save(id, data);
      state.remove(id);
      expect(state.has(id)).to.be.false;
    });

    it('should remove only specific keys if provided', () => {
      const state = STATE();
      const id = 123;
      const data = {a: 1, b: 2};

      state.save(id, data);
      state.remove(id, ['a']);
      expect(state.get(id).a).to.not.exist;
      expect(state.get(id).b).to.be.equal(2);
    });
  });

  describe('all', () => {
    it('should give us an empty list of keys with no data', () => {
      const state = STATE();
      expect(state.all()).to.be.empty;
    });

    it('should give us a list of known object keys', () => {
      const state = STATE();
      state.save(123, {a: 1});
      state.save(124, {b: 2});
      state.save(125, {b: 3});
      expect(state.all().length).to.be.equal(3);
    });

    it('should give us a list of known object keys', () => {
      const state = STATE();
      state.save(123, {a: 1});
      state.save(124, {b: 2});
      state.save(125, {b: 3});
      state.remove(124);
      expect(state.all().length).to.be.equal(2);
    });
  });
});
