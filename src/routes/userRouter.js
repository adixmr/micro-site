const express     = require('express');
const router      = express.Router();
const auth = require('../middleware/auth')
const {getAllUsers, registerUser, authenticateUser, followUser, unfollowUser, getFollowers, getFollowings} = require('../controllers/userController')

router.post('/login', authenticateUser)
router.post('/register', registerUser)
router.post('/follow/:id', auth, followUser)
router.post('/unfollow/:id', auth, unfollowUser)

router.get('/followers', auth, getFollowers)
router.get('/followings', auth, getFollowings)
router.get('/get', getAllUsers)

module.exports = router;