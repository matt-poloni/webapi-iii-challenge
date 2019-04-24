const express = require('express');

const db = require('../data/helpers/postDb');

const router = express.Router();

router.get('/', (req, res) => {
  db.get()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: 'The posts data could not be retrieved.' }))
})

module.exports = router;