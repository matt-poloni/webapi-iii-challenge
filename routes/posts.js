const express = require('express');

const db = require('../data/helpers/postDb');
const dbUsers = require('../data/helpers/userDb');

const router = express.Router();

// CUSTOM MIDDLEWARE

const hasText = (req, res, next) => {
  !req.body.text
    ? res.status(400).json({ error: 'Please provide text for the post.' })
    : next();
}

const hasUserID = (req, res, next) => {
  !req.body.user_id
    ? res.status(400).json({ error: 'Please provide a user_id for the post.' })
    : next();
}

const validUserID = async (req, res, next) => {
  const invalid = await dbUsers.getById(req.body.user_id);
  !invalid
    ? res.status(400).json({ error: 'The specified user_id does not exist. Please provide a valid user_id.' })
    : next();
}

// ENDPOINTS

router.get('/', (req, res) => {
  db.get()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: 'The posts data could not be retrieved.' }))
})

router.post('/', hasText, hasUserID, validUserID, (req, res) => {
  const newPost = req.body;
  db.insert(newPost)
    .then(inserted => res.status(201).json(inserted))
    .catch(err => res.status(500).json({ error: 'There was an error while creating the new post.' }))
})

router.get('/:id', (req, res) => {
  const postID = req.params.id;
  db.getById(postID)
    .then(post => {
      !post
        ? res.status(404).json({ error: 'The post with the specified ID does not exist.' })
        : res.status(200).json(post);
    })
    .catch(err => res.status(500).json({ error: 'The post information could not be retrieved' }))
})

router.put('/:id', hasText, hasUserID, validUserID, (req, res) => {
  const newPost = req.body;
  const postID = req.params.id;
  db.update(postID, newPost)
    .then(async count => {
      !count
        ? res.status(404).json({ error: 'The post with the specified ID does not exist.' })
        : res.status(200).json(await db.getById(postID));
    })
    .catch(err => res.status(500).json({ error: 'The post information could not be modified.' }))
})

router.delete('/:id', (req, res) => {
  const postID = req.params.id;
  db.remove(postID)
    .then(async count => {
      !count
        ? res.status(404).json({ error: 'The post with the specified ID does not exist.' })
        : res.status(200).json(await db.getById(postID));
    })
    .catch(err => res.status(500).json({ error: 'The post could not be removed.' }));
})

module.exports = router;