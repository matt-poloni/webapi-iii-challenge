const express = require('express');

const db = require('../data/helpers/userDb');

const router = express.Router();

router.get('/', (req, res) => {
  db.get()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: 'The users data could not be retrieved.' }))
})

module.exports = router;