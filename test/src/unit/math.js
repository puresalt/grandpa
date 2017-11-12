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

import Math from '../../../src/math';

describe('Math', () => {
  describe('between', () => {
    it('should be true if a number is between', () => {
      expect(Math.between(5, 1, 10)).to.be.true;
    });

    it('should be false if a number is below', () => {
      expect(Math.between(1, 2, 10)).to.be.false;
    });

    it('should be false if a number is above', () => {
      expect(Math.between(11, 1, 10)).to.be.false;
    });
  });

  describe('coolDown', () => {
    it('should return zero for an empty value', () => {
      expect(Math.coolDown()).to.equal(0);
    });

    it('should increment by 1 as a default', () => {
      expect(Math.coolDown(10)).to.equal(9);
    });

    it('should increment by a given number', () => {
      expect(Math.coolDown(10, 5)).to.equal(5);
    });
  });

  describe('minMax', () => {
    it('should give me the number provided if it is within the range', () => {
      expect(Math.minMax(7, 5, 10)).to.equal(7);
    });

    it('should give me the minimum value if number is below', () => {
      expect(Math.minMax(4, 5, 10)).to.equal(5);
    });
    it('should give me the maximum value if number is above', () => {
      expect(Math.minMax(11, 5, 10)).to.equal(10);
    });
  });

  describe('overlap', () => {
    it('should return true if dimensions overlap', () => {
      const a = {
        x: 10,
        y: 10,
        h: 20,
        w: 20
      };
      const b = {
        x: 15,
        y: 15,
        h: 20,
        w: 20
      };
      expect(Math.overlap(a, b)).to.be.true;
    });

    it('should return false if dimensions do not overlap', () => {
      const a = {
        x: 10,
        y: 10,
        h: 20,
        w: 20
      };
      const b = {
        x: 35,
        y: 35,
        h: 20,
        w: 20
      };
      expect(Math.overlap(a, b)).to.be.false;
    });
  });

  describe('random', () => {
    it('should return a random number between min/max', () => {
      const min = 1;
      const max = 100;
      const randomNumber = Math.random(min, max);
      expect(Math.between(randomNumber, min, max)).to.be.true;
      expect(randomNumber).to.be.a('number');
    });
  });

  describe('randomChoice', () => {
    it('should return a random choice from an array', () => {
      const choices = ['a', 'b'];
      const randomChoice = Math.randomChoice(choices);
      expect(randomChoice === 'a' || randomChoice === 'b').to.be.true;
    });
  });

  describe('randomBoolean', () => {
    it('should randomly return true or false', () => {
      expect(Math.randomBoolean()).to.be.a('boolean');
    });
  });

  describe('randomNumber', () => {
    it('should return a random integer between min/max', () => {
      const min = 1;
      const max = 100;
      const randomNumber = Math.randomNumber(min, max);
      expect(Math.between(randomNumber, min, max)).to.be.true;
    });
  });

  describe('getDegreeOfPoints', () => {
    it('should return the expected degree of our given points', () => {
      expect(Math.getDegreeOfPoints(10, 10, 5, 5)).to.equal(45);
    });
  });

  describe('setPointOnEllipse', () => {
    it('should set x, y to an object based off of the ellipse points', () => {
      const reusedObject = {
        x: 0,
        y: 0
      };
      const origin = {
        x: 10,
        y: 10
      };
      const ellipse = {
        height: 20,
        width: 40,
        angle: 45
      };
      Math.setPointOnEllipse(origin, ellipse, reusedObject);
      expect(reusedObject.x).to.equal(31.01287955270919);
      expect(reusedObject.y).to.equal(27.01807049068237);
    });
  });

  describe('getPointOnQuadraticCurve', () => {
    it('should give us a point based off of time along a quadratic curve', () => {
      expect(Math.getPointOnQuadraticCurve(5, 1, 20, 0.5)).to.equal(6.75);
    });
  });

  describe('round', () => {
    it('should stay the same on an integer', () => {
      expect(Math.round(3)).to.equal(3);
    });

    it('should round down below 0.5', () => {
      expect(Math.round(2.4999999)).to.equal(2);
    });

    it('should round up on 0.5', () => {
      expect(Math.round(2.5)).to.equal(3);
    });
  });
});
