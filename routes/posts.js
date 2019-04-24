const express = require('express');

const db = require('../data/helpers/postDb');

const router = express.Router();

router.get('/', (req, res) => {
  db.get()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: 'The posts data could not be retrieved.' }))
})

router.post('/', (req, res) => {
  const newPost = req.body;
  !newPost.text || !newPost.user_id
    ? res.status(400).json({ error: 'Please provide text and a user_id for the new post.' })
    : db.insert(newPost)
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

module.exports = router;