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

/* jshint ignore:start */
const mangleProperties = {regex: /^_/};

const options = {
  mangleProperties: {regex: /^_/},
  banner: '/*! NUMBER ONE GRANDPA (Generated: <%= grunt.template.today("yyyy-mm-dd") %>) */',
  mangle: {
    toplevel: true,
    eval: true
  },
  compress: {
    sequences: true,
    conditionals: true,
    booleans: true,
    unused: true,
    if_return: true,
    join_vars: true,
    drop_console: true
  }
};

module.exports = {
  grandpa: {
    mangleProperties: mangleProperties,
    options: options,
    files: {
      'build/grandpa.js': 'build/grandpa.dev.js'
    }
  }
};
/* jshint ignore:end */
