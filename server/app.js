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

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const routeState = require('./router/state');

/**
 * Define our server and load it if this isn't being imported.
 *
 * @param {String} environment
 * @returns {*|Function}
 */
const runServer = (environment) => {
  let app = express();
  app.use('/assets', express.static(path.join(__dirname, '../', 'assets')));
  app.use('/build', express.static(path.join(__dirname, '../', 'build')));
  app.use(express.static(path.join(__dirname, '../', '/static')));
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  app.use('/state', routeState);

  /* If we're in a dev environment then we should show coverage */
  if (environment === 'development') {
    app.use('/coverage', express.static(path.join(__dirname, '../', 'coverage/app/lcov-report')));
    app.use('/coverage-server', express.static(path.join(__dirname, '../', 'coverage/server/lcov-report')));
  }

  return app;
};

if (module.parent) {
  module.exports = runServer;
} else {
  process.title = process.argv[2];
  const port = process.env.PORT || 5001;
  runServer(process.env.NODE_ENV)
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn('Port: ' + port + ' is already in use');
      }
    })
    .listen(port);
}
