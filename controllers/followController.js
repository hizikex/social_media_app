const Follow = require("../models/followModel");
const User = require("../models/userModel");
const { Sequelize } = require("sequelize");

exports.followUser = async (req, res) => {
    try {
        const { follower_id, following_id } = req.body;
        if (follower_id === following_id) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        const follower = await Follow.findOne({
            where: {
                follower_id,
                following_id
            }
        });

        if (follower) {
            return res.status(400).json({
                message: "You are already following this user"
            });
        }

        const follow = await Follow.create({
            follower_id,
            following_id
        });

        res.status(201).json({
            message: "User followed successfully",
            data: follow
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            data: error.message
        });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const { follower_id, following_id } = req.body;
        const follow = await Follow.findOne({
            where: {
                follower_id,
                following_id
            },
        });

        if (!follow) {
            return res.status(400).json({
                message: "You are not following this user"
            });
        }

        await Follow.destroy({
            where: {
                follower_id,
                following_id
            },
        });

        res.status(200).json({
            message: "User unfollowed successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            data: error.message
        });
    }
};

exports.userFollowers = async (req, res) => {
    try {
        const followers = await Follow.findAll({
            where: {
                following_id: req.params.id
            },
            include: [{
                model: User,
                as: "follower",
                attributes: ["id", "fullname", "email"]
            }],
        });
        res.status(200).json({
            message: "User followers fetched successfully",
            data: followers
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            data: error.message
        });
    }
};

exports.userFollowings = async (req, res) => {
    try {
        const followers = await Follow.findAll({
            where: {
                follower_id: req.params.id
            },
            include: [{
                model: User,
                as: "following",
                attributes: ["id", "fullname", "email"]
            }],
        });
        res.status(200).json({
            message: "User followings fetched successfully",
            data: followers
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            data: error.message
        });
    }
};

exports.getMutualFollowers = async (req, res) => {
    try {
        const { follower_id, following_id } = req.params;
        const user1follower = await Follow.findAll({
            attributes:  ["follower_id"],
            where: {
                following_id: follower_id
            }
        });

        const user2follower = await Follow.findAll({
            attributes:  ["follower_id"],
            where: {
                following_id: following_id
            }
        });

        const user1followerIds = user1follower.map(follow => follow.follower_id);
        const user2followerIds = user2follower.map(follow => follow.follower_id);
        const mutualFollowerIds = user1followerIds.filter(followerId => user2followerIds.includes(followerId));

        const mutualFollowers = await User.findAll({
            where: {
                id: mutualFollowerIds
            }
        });

        res.status(200).json({
            message: "Mutual followers fetched successfully",
            data: mutualFollowers
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            data: error.message
        });
    }
};
