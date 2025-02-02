const express = require('express');
const followController = require('../controllers/followController');

const router = express.Router();

router.post('/follow', followController.followUser);
router.post('/unfollow', followController.unfollowUser);
router.get('/followers/:id', followController.userFollowers);
router.get('/followings/:id', followController.userFollowings);
router.get('/mutual/:follower_id/:following_id', followController.getMutualFollowers);

module.exports = router;
