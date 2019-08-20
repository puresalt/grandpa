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

/** @module router/state */

'use strict';

/* eslint no-console: off */

const express = require('express');
const router = express.Router();
const helper = require('../helper');
const State = require('../state');
const state = State();

/**
 * Get all of the ids from our states.
 *
 * @name GET /state
 * @memberof module:router/state
 * @inner
 * @param {String} path
 * @param {callback} route
 */
router.get('/', (req, res) => {
  res.status(200).json(state.all());
});

/**
 * Don't do anything.
 *
 * @name PUT /state
 * @memberof module:router/state
 * @inner
 * @param {String} path
 * @param {callback} route
 */
router.put('/', (req, res) => {
  res.status(404).json({});
});

/**
 * Don't do anything.
 *
 * @name DELETE /state
 * @memberof module:router/state
 * @inner
 * @param {String} path
 * @param {callback} route
 */
router.delete('/', (req, res) => {
  res.status(404).json({});
});

/**
 * Save our state data for a given user.
 *
 * @name POST /state
 * @memberof module:router/state
 * @inner
 * @param {String} path
 * @param {callback} route
 */
router.post('/', (req, res) => {
  const id = helper.generateId();
  state.save(id, req.body);
  console.log('CREATED:', id, state.get(id));
  res.set('Location', `/state/${id}`).status(201).json(state.get(id));
});

/**
 * Load our state data for a given user.
 *
 * @name GET /state/:id
 * @memberof module:router/state
 * @inner
 * @param {String} path
 * @param {callback} route
 */
router.get('/:id', (req, res) => {
  const id = req.params.id;
  if (!state.has(id)) {
    return res.status(404).json({});
  }
  const data = state.get(id);
  console.log('LOADED:', id, data);
  res.status(200).json(data);
});

/**
 * Save our state data for a given user.
 *
 * @name POST /state/:id
 * @memberof module:router/state
 * @inner
 * @param {String} path
 * @param {callback} route
 */
router.post('/:id', (req, res) => {
  const id = req.params.id;
  if (state.has(id)) {
    return res.status(403).json({});
  }
  state.save(id, req.body);
  console.log('SAVED:', id, state.get(id));
  res.set('Location', `/state/${id}`).status(201).json(state.get(id));
});

/**
 * Save our state data for a given user.
 *
 * @name PUT /state/:id
 * @memberof module:router/state
 * @inner
 * @param {String} path
 * @param {callback} route
 */
router.put('/:id', (req, res) => {
  const id = req.params.id;
  if (!state.has(id)) {
    return res.status(404).json({});
  }
  state.save(id, req.body);
  console.log('UPDATED:', id, state.get(id));
  res.status(200).json(state.get(id));
});

/**
 * Delete save data for a given user.
 *
 * @name DELETE /state/:id
 * @memberof module:router/state
 * @inner
 * @param {String} path
 * @param {callback} route
 */
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if (!state.has(id)) {
    return res.status(404).json({});
  }
  state.remove(id);
  console.log('REMOVED:', id);
  res.status(204);
});

module.exports = router;
