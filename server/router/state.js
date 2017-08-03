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
const STATE = require('../state');
const state = STATE();

/**
 * Get all of the ids from our states.
 */
router.get('/', (req, res) => {
  res.status(200).json(state.all());
});

/**
 * Don't do anything.
 */
router.put('/', (req, res) => {
  res.status(404).json({});
});

/**
 * Don't do anything.
 */
router.delete('/', (req, res) => {
  res.status(404).json({});
});

/**
 * Save our state data for a given user.
 */
router.post('/', (req, res) => {
  let id = helper.generateId();
  state.save(id, req.body);
  console.log('CREATED:', id, state.get(id));
  res.status(200).json(state.get(id));
});

/**
 * Load our state data for a given user.
 */
router.get('/:id', (req, res) => {
  let id = req.params.id;
  if (!state.has(id)) {
    return res.status(404).json({});
  }
  let data = state.get(id);
  console.log('LOADED:', id, data);
  res.status(200).json(data);
});

/**
 * Save our state data for a given user.
 */
router.post('/:id', (req, res) => {
  let id = req.params.id;
  if (state.has(id)) {
    return res.status(403).json({});
  }
  state.save(id, req.body);
  console.log('SAVED:', id, state.get(id));
  res.status(200).json(state.get(id));
});

/**
 * Save our state data for a given user.
 */
router.put('/:id', (req, res) => {
  let id = req.params.id;
  if (!state.has(id)) {
    return res.status(404).json({});
  }
  state.save(id, req.body);
  console.log('UPDATED:', id, state.get(id));
  res.status(200).json(state.get(id));
});

/**
 * Delete save data for a given user.
 */
router.delete('/:id', (req, res) => {
  let id = req.params.id;
  if (!state.has(id)) {
    return res.status(404).json({});
  }
  state.remove(id);
  console.log('REMOVED:', id);
  res.status(204);
});

module.exports = router;
