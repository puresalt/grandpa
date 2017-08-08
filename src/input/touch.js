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

/* jshint maxcomplexity:10, maxstatements:24 */
/* globals document */

'use strict';

import _ from 'lodash/fp';
import KEY from './key';
import EVENT from '../event';
import PUB_SUB from '../pubSub';
import SIZER from '../sizer';
import MathUtility from '../math';
const INNER_DEADZONE = 0.1;

const _defaultConfig = {
  type: 'touch',
  keys: [
    {input: KEY.DIRECTIONAL, element: 'directional'},
    {input: KEY.PUNCH, element: 'punch'},
    {input: KEY.KICK, element: 'kick'},
    {input: KEY.JUMP, element: 'jump'},
    {input: KEY.CROUCH, element: 'crouch'},
    {input: KEY.MENU, element: 'menu'},
    {input: KEY.DEBUG, element: 'debug'}
  ]
};

/**
 * Function to first map a configuration to our Input.KEY enum, and then to map that to an event lookup and attach it to
 * our element's event listener.
 *
 * @param {Object} config
 * @param {Object} inputState
 * @param {StateMachine?} context
 * @returns {{getConfig: Function}}
 */
export default function TouchInput(config, inputState, context) {
  const _extendedConfig = _.defaults(_defaultConfig, config || {});
  const _elementList = _generateElementList(_extendedConfig.keys);

  /**
   * Helper function to add our event listener on press.
   *
   * @param {String} found
   * @returns {function(*=)}
   * @private
   */
  const _pressEventListener = (found) => {
    return (event) => {
      if (found === KEY.DIRECTIONAL) {
        if (!_handleDirectionalEvent(inputState, event, context)) {
          return;
        }
      } else if (!inputState.triggerEvent(EVENT.PRESS, found, context)) {
        return;
      }
      if (event.preventDefault) {
        event.preventDefault();
      }
      event.cancelBubble = true;
      event.returnValue = false;
      return false;
    };
  };

  /**
   * Helper function to add our event listener on press.
   *
   * @param {String} found
   * @returns {function(*=)}
   * @private
   */
  const _releaseEventListener = (found) => {
    return (event) => {
      if (!inputState.triggerEvent(EVENT.RELEASE, found, context)) {
        return;
      }
      if (event.preventDefault) {
        event.preventDefault();
      }
      event.cancelBubble = true;
      event.returnValue = false;
      return false;
    };
  };

  const _elements = _elementList.map(item => {
    item.element = _findElementOrCreateIt('button-' + item.element);
    item.element.style.display = 'visible';
    item.press = _pressEventListener(item.input);
    item.release = _releaseEventListener(item.input);
    item.element.addEventListener('touchstart', item.press);
    item.element.addEventListener('touchmove', item.press);
    item.element.addEventListener('touchend', item.release);
    item.element.addEventListener('touchcancel', item.release);
    return item;
  }, []);

  const _resizer = () => {
    const directional = _findElementOrCreateIt('button-directional');
    directional.style.height = directional.style.width = SIZER.relativeSize(SIZER.height / 3) + 'px';
    directional.style.bottom = (SIZER.maxHeight - SIZER.height) + 'px';
    const abxy = _findElementOrCreateIt('button-abxy');
    abxy.style.bottom = (SIZER.maxHeight - SIZER.height) + 'px';
    abxy.style.right = (SIZER.maxWidth - SIZER.width) + 'px';
    for (let i = 0, count = abxy.childNodes.length; i < count; i = i + 1) {
      abxy.childNodes[i].style.height = abxy.childNodes[i].style.width = SIZER.relativeSize(SIZER.height / 3 / 2) + 'px';
    }
  };
  const _subscribed = PUB_SUB.subscribe(EVENT.RESIZE, _resizer);
  _resizer();

  return {
    /**
     * Get the current config.
     *
     * @returns {*}
     */
    getConfig() {
      return _extendedConfig;
    },

    /**
     * Remove our event listeners in the case that we're going to switch input.
     */

    remove() {
      for (let i = 0, count = _elements.length; i < count; i = i + 1) {
        let item = _elements[i];
        item.element.style.display = 'none';
        item.element.removeEventListener('touchstart', item.press);
        item.element.removeEventListener('touchmove', item.press);
        item.element.removeEventListener('touchend', item.release);
        item.element.removeEventListener('touchcancel', item.release);
        _elements[i] = null;
      }
      _elements.length = 0;
      _subscribed.unsubscribe();
    }
  };
}

/**
 * Generate our element list.
 *
 * @param {Array} elements
 * @returns {Object}
 */
function _generateElementList(elements) {
  return elements.reduce((gathered, item) => {
    gathered.push(item);
    return gathered;
  }, []);
}

/**
 * We need to handle directional events differently than just a button down. Need to compare coordinates and then
 * trigger the necessary events.
 *
 * @param {Object} inputState
 * @param {TouchEvent} event
 * @param {Object} context
 * @returns {Boolean}
 * @private
 */
function _handleDirectionalEvent(inputState, event, context) {
  const element = event.target || event.srcElement;
  const diameter = element.clientWidth;
  const radius = Math.round(diameter / 2);
  const clientX = element.offsetLeft;
  const clientY = element.offsetTop;
  const touchEvent = event.touches[0];
  const touchX = touchEvent.clientX - clientX;
  const touchY = touchEvent.clientY - clientY;

  // If we are within the innerDeadzone or outside of the circle then we should release our keys and return.
  if (_insideCircle(touchX, touchY, radius, radius, radius * INNER_DEADZONE) || !_insideCircle(touchX, touchY, radius, radius, radius)) {
    return inputState.triggerEvent(EVENT.RELEASE, KEY.DIRECTIONAL, context);
  }

  return inputState.triggerEvent(EVENT.PRESS, KEY.DIRECTIONAL, context, -1 * Math.round(MathUtility.getDegreeOfPoints(touchX, touchY, radius, radius)));
}

/**
 * Check to see if we're within the inner deadzone.
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} centerX
 * @param {Number} centerY
 * @param {Number} radius
 * @private
 */
function _insideCircle(x, y, centerX, centerY, radius) {
  const checkX = x - centerX;
  const checkY = y - centerY;
  return (checkX * checkX) + (checkY * checkY) < (radius * radius);
}

/**
 * Create a button if it doesn't already exist.
 *
 * @param id
 * @private
 */
function _findElementOrCreateIt(id) {
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement('div');
    element.id = id;
    if (id === 'button-directional' || id === 'button-abxy') {
      document.body.appendChild(element);
    } else {
      let abxy = _findElementOrCreateIt('button-abxy');
      abxy.appendChild(element);
    }
  }
  return element;
}