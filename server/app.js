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
 * @param {String} environment Expecting either `development` or `production` in terms of what environment to run in.
 * @returns {express.Server} Returns an Express server with all of our routes and modules setup.
 * @module server
 */
const createServer = (environment) => {
  const app = express();
  app.use('/asset', express.static(path.join(__dirname, '../', 'asset')));
  app.use('/build', express.static(path.join(__dirname, '../', 'build')));
  app.use(express.static(path.join(__dirname, '../', '/static')));
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  app.use('/state', routeState);

  /* If we're in a dev environment then we should show coverage */
  if (environment === 'development') {
    const loadIndex = (page) => {
      const properizedPage = page.charAt(0).toUpperCase() + page.slice(1);
      const html = [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '<meta charset="utf-8">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="apple-mobile-web-app-capable" content="yes">',
        '<meta name="apple-mobile-web-app-status-bar-style" content="black">',
        '<meta name="apple-mobile-web-app-title" content="#1 Grandpa">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui">',
        `<title>Development (${properizedPage})</title>`,
        '</head>',
        '<body>',
        `<h1>Development (${properizedPage})</h1>`,
        '<hr/>',
        '<ul>',
        `<li><a href="/${page}/coverage">Coverage</a></li>`,
        `<li><a href="/${page}/documentation">Documentation</a></li>`,
        '</ul>',
        '</body>',
        '</html>'
      ].join('');
      return (req, res) => res.send(html);
    };
    app.use('/app/coverage', express.static(path.join(__dirname, '../', 'build/app/coverage')));
    app.use('/app/documentation', express.static(path.join(__dirname, '../', 'build/app/documentation')));
    app.use('/server/coverage', express.static(path.join(__dirname, '../', 'build/server/coverage')));
    app.use('/server/documentation', express.static(path.join(__dirname, '../', 'build/server/documentation')));
    app.get('/app', loadIndex('app'));
    app.get('/server', loadIndex('server'));
  }

  return app;
};

if (module.parent) {
  module.exports = createServer;
} else {
  const title = process.argv[2] || 'grandpa-server';
  const environment = process.env.NODE_ENV || 'development';
  const port = process.env.PORT || 4001;

  console.log('title:', title);
  console.log('environment:', environment);
  console.log('port:', port);

  process.title = title;
  createServer(process.env.NODE_ENV)
    .on('error', err => err.code === 'EADDRINUSE' && console.warn('Port: ' + port + ' is already in use'))
    .listen(port);
}
