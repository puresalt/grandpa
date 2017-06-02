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

const express = require('express');
const router = express.Router();
const helper = require('../helper');

const headers = {
  'Content-Type': 'application/json'
};

/** @TODO Transfer this to a datastore and add authentication on top of this router. */
let states = {};

/**
 * Get all of the ids from our states.
 */
router.get('/', (req, res) => {
  res.writeHead(200, headers);
  res.send(Object.keys(states));
});

/**
 * Save our state data for a given user.
 */
router.post('/', (req, res) => {
  res.writeHead(200, headers);
  res.send({id: helper.generateId()});
});

/**
 * Load our state data for a given user.
 */
router.get('/:id', (req, res) => {
  let statusCode = 404;
  let response = {};
  if (states[req.params.id]) {
    statusCode = 200;
    response = states[req.params.id];
  }
  res.writeHead(statusCode, headers);
  res.send(response);
});

/**
 * Save our state data for a given user.
 */
router.post('/:id', (req, res) => {
  let statusCode = 403;
  if (!states[req.params.id]) {
    statusCode = 200;
    states[req.params.id] = req.body;
  }
  res.writeHead(statusCode, headers);
  res.send({id: req.params.id});
});

/**
 * Save our state data for a given user.
 */
router.put('/:id', (req, res) => {
  states[req.params.id] = req.body;
  res.writeHead(200, headers);
  res.send({id: req.params.id});
});

/**
 * Delete save data for a given user.
 */
router.delete('/:id', (req, res) => {
  let statusCode = 404;
  let response = {};
  if (states[req.params.id]) {
    statusCode = 204;
    delete states[req.params.id];
  }
  res.writeHead(statusCode, headers);
  res.send(response);
});

module.exports = router;
