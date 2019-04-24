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

router.get('/:id', (req, res) => {
  const userID = req.params.id;
  db.getById(userID)
    .then(user => {
      !user
        ? res.status(404).json({ error: 'The user with the specified ID does not exist.' })
        : res.status(200).json(user);
    })
    .catch(err => res.status(500).json({ error: 'The user information could not be retrieved' }))
})

router.put('/:id', nameUpperCase, (req, res) => {
  const newUser = req.body;
  const userID = req.params.id;
  !newUser.name
    ? res.status(400).json({ error: 'Please provide a name for the user you wish to update.' })
    : db.update(userID, newUser)
        .then(async count => {
          const updated = await db.getById(userID);
          !count
            ? res.status(404).json({ error: 'The user with the specified ID does not exist.' })
            : res.status(200).json(updated);
        })
        .catch(err => res.status(500).json({ error: 'The user information could not be modified.' }))
})

module.exports = router;