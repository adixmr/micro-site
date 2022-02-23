const express     = require('express');
const router      = express.Router();
const auth = require('../middleware/auth')
const {createPost, likePost, unlikePost, getFeed, getSinglePost} = require('../controllers/postController')

router.post('/', auth, createPost)
router.post('/like/:id', auth, likePost)
router.post('/unlike/:id', auth, unlikePost)

router.get('/', getFeed)
router.get('/:id', getSinglePost)

module.exports = router;