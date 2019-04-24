const express = require('express');

const db = require('../data/helpers/postDb');
const dbUsers = require('../data/helpers/userDb');

const router = express.Router();

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

router.get('/', (req, res) => {
  db.get()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: 'The posts data could not be retrieved.' }))
})

router.post('/', hasText, hasUserID, (req, res) => {
  const newPost = req.body;
  !dbUsers.getById(newPost.user_id)
    ? res.status(400).json({ error: 'Please provide a valid user_id.' })
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

router.put('/:id', hasText, hasUserID, (req, res) => {
  const newPost = req.body;
  const postID = req.params.id;
  !dbUsers.getById(newPost.user_id)
    ? res.status(400).json({ error: 'Please provide a valid user_id.' })
    : db.update(postID, newPost)
      .then(async count => {
        console.log(count)
        const updated = await db.getById(postID);
        !count
          ? res.status(404).json({ error: 'The post with the specified ID does not exist.' })
          : res.status(200).json(updated);
      })
      .catch(err => res.status(500).json({ error: 'The post information could not be modified.' }))
})

router.delete('/:id', async (req, res) => {
  const postID = req.params.id;
  const deleted = await db.getById(postID);
  db.remove(postID)
    .then(count => {
      !count
        ? res.status(404).json({ error: 'The post with the specified ID does not exist.' })
        : res.status(200).json(deleted);
    })
    .catch(err => res.status(500).json({ error: 'The post could not be removed.' }));
})

module.exports = router;