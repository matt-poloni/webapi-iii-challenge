const express = require('express');

const db = require('../data/helpers/userDb');

const router = express.Router();

const nameUpperCase = (req, res, next) => {
  if(req.body.name) {
    req.body.name = req.body.name.toUpperCase();
  }
  next();
}

router.get('/', (req, res) => {
  db.get()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: 'The users data could not be retrieved.' }))
})

router.post('/', nameUpperCase, (req, res) => {
  const newUser = req.body;
  !newUser.name
    ? res.status(400).json({ error: 'Please provide a name for the new user.' })
    : db.insert(newUser)
        .then(inserted => res.status(201).json(inserted))
        .catch(err => res.status(500).json({ error: 'There was an error while creating the new user.' }))
})

module.exports = router;