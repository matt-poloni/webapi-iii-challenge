const express = require('express');

const db = require('../data/helpers/userDb');

const router = express.Router();

// CUSTOM MIDDLEWARE

const hasName = (req, res, next) => {
  !req.body.name
    ? res.status(400).json({ error: 'Please provide a name for the user.' })
    : next();
}

const nameUpperCase = (req, res, next) => {
  // Best used after hasName
  req.body.name = req.body.name.toUpperCase();
  next();
}

const validID = async (req, res, next) => {
  const invalid = await db.getById(req.params.id);
  !invalid
    ? res.status(400).json({ error: 'The specified user id does not exist. Please provide a valid user id.' })
    : next();
}

// ENDPOINTS

router.get('/', (req, res) => {
  db.get()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: 'The users data could not be retrieved.' }))
})

router.post('/', hasName, nameUpperCase, (req, res) => {
  const newUser = req.body;
  db.insert(newUser)
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

router.put('/:id', hasName, nameUpperCase, (req, res) => {
  const newUser = req.body;
  const userID = req.params.id;
  db.update(userID, newUser)
    .then(async count => {
      !count
        ? res.status(404).json({ error: 'The user with the specified ID does not exist.' })
        : res.status(200).json(await db.getById(userID));
    })
    .catch(err => res.status(500).json({ error: 'The user information could not be modified.' }))
})

router.delete('/:id', (req, res) => {
  const userID = req.params.id;
  db.remove(userID)
    .then(async count => {
      !count
        ? res.status(404).json({ error: 'The user with the specified ID does not exist.' })
        : res.status(200).json(await db.getById(userID));
    })
    .catch(err => res.status(500).json({ error: 'The user could not be removed.' }));
})

router.get('/:id/posts', validID, (req, res) => {
  const userID = req.params.id;
  db.getUserPosts(userID)
    .then(posts => {
      !posts.length
        ? res.status(404).json({ error: 'The specified user has no posts in our database.' })
        : res.status(200).json(posts);
    })
    .catch(err => res.status(500).json({ error: 'The user information could not be retrieved' }))
})

module.exports = router;