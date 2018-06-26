/**
 * NUMBER ONE GRANDPA
 *
 * LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:  * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@puresalt.gg so we can send you a copy immediately.
 *
 */

'use strict';

const LOOKUP = {
  '8-0': 'BACKSPACE',
  '9-0': 'TAB',
  '13-0': 'RETURN',
  '16-1': 'SHIFT_LEFT',
  '16-2': 'SHIFT_RIGHT',
  '17-1': 'COMMAND_LEFT',
  '17-2': 'COMMAND_RIGHT',
  '18-1': 'OPTION_LEFT',
  '18-2': 'OPTION_RIGHT',
  '19-0': 'PAUSE',
  '20-0': 'CAPS_LOCK',
  '27-0': 'ESC',
  '32-0': 'SPACE',
  '33-0': 'PAGE_UP',
  '34-0': 'PAGE_DOWN',
  '35-0': 'END',
  '36-0': 'HOME',
  '37-0': 'LEFT',
  '38-0': 'UP',
  '39-0': 'RIGHT',
  '40-0': 'DOWN',
  '45-0': 'INSERT',
  '46-0': 'DELETE',
  '48-0': '0',
  '49-0': '1',
  '50-0': '2',
  '51-0': '3',
  '52-0': '4',
  '53-0': '5',
  '54-0': '6',
  '55-0': '7',
  '56-0': '8',
  '57-0': '9',
  '65-0': 'A',
  '66-0': 'B',
  '67-0': 'C',
  '68-0': 'D',
  '69-0': 'E',
  '70-0': 'F',
  '71-0': 'G',
  '72-0': 'H',
  '73-0': 'I',
  '74-0': 'J',
  '75-0': 'K',
  '76-0': 'L',
  '77-0': 'M',
  '78-0': 'N',
  '79-0': 'O',
  '80-0': 'P',
  '81-0': 'Q',
  '82-0': 'R',
  '83-0': 'S',
  '84-0': 'T',
  '85-0': 'U',
  '86-0': 'V',
  '87-0': 'W',
  '88-0': 'X',
  '89-0': 'Y',
  '90-0': 'Z',
  '91-0': 'WINDOWS_LEFT',
  '91-1': 'CTRL_LEFT',
  '91-2': 'CTRL_RIGHT',
  '92-0': 'WINDOWS_RIGHT',
  '96-0': 'NUMPAD_0',
  '97-0': 'NUMPAD_1',
  '98-0': 'NUMPAD_2',
  '99-0': 'NUMPAD_3',
  '100-0': 'NUMPAD_4',
  '101-0': 'NUMPAD_5',
  '102-0': 'NUMPAD_6',
  '103-0': 'NUMPAD_7',
  '104-0': 'NUMPAD_8',
  '105-0': 'NUMPAD_9',
  '106-0': 'NUMPAD_MULTIPLY',
  '107-0': 'NUMPAD_ADD',
  '109-0': 'NUMPAD_SUBTRACT',
  '110-0': 'NUMPAD_DECIMAL',
  '111-0': 'NUMPAD_DIVIDE',
  '112-0': 'F1',
  '113-0': 'F2',
  '114-0': 'F3',
  '115-0': 'F4',
  '116-0': 'F5',
  '117-0': 'F6',
  '118-0': 'F7',
  '119-0': 'F8',
  '120-0': 'F9',
  '186-0': ';',
  '187-0': '=',
  '188-0': ',',
  '189-0': '-',
  '190-0': '.',
  '191-0': '/',
  '192-0': '`',
  '222-0': '\'',
  '219-0': '[',
  '220-0': '\\',
  '221-0': ']'
};
Object.freeze(LOOKUP);

const REVERSE_LOOKUP = Object.keys(LOOKUP).reduce((gathered, item) => {
  gathered[LOOKUP[item]] = item;
  return gathered;
}, {});
Object.freeze(REVERSE_LOOKUP);

/**
 * Lookup a given human readable key.
 *
 * @param {String} key
 * @returns {String|Boolean}
 */
function lookup(key) {
  return LOOKUP[key]
    ? LOOKUP[key]
    : false;
}

/**
 * Get the key's number via a human readable key.
 *
 * @param {String} key
 * @returns {String|Boolean}
 */
function reverseLookup(key) {
  return REVERSE_LOOKUP[key]
    ? REVERSE_LOOKUP[key]
    : false;
}

export {lookup, reverseLookup};
