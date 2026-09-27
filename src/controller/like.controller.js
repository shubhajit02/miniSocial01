import { Post } from "../model/post.model.js";
import { User } from "../model/user.model.js";
import { Like } from '../model/like.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";


const postLike = asyncHandler(async (req, res) => {
    //post id
    //who is the user(authenticated user);

    const postId = req.params?.id;
    const user = req.user._id;

    const postExist = await Post.findById(postId);
    if (!postExist) {
        throw new ApiError(404, "Post does not exist")
    };

    const userExist = await User.findById(user);
    if (!userExist) {
        throw new ApiError(404, "User does not exist")
    };

    const like = await Like.create({
        owner: user,
        post: postId
    });

    if (!like) {
        throw new ApiError(401, "could not be liked")
    };

    res.status(200).json(new ApiResponse(200, like, "like created on the post"))

});

const getLikesAndUsersFromPost = asyncHandler(async (req, res) => {
    const postId = req.params?.id;
    const userId = req.user?.id;

    const postExist = await Post.findById(postId);
    if (!postId) {
        throw new ApiError(404, 'Post does not exist')
    };

    const usersWholiked = await Like.aggregate([
        {
            $match: {
                post: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $unwind: '$users'
        },
        {
            $project: {
                _id: '$users._id',
                fullName: '$users.fullName',
                username: '$users.username',
                email: '$users.email',
                avatar: '$users.avatar'
            }
        }

    ]);

    const totalLikes = usersWholiked.length;
    res.status(200).json(new ApiResponse(200, {
        totalLikes,
        users: usersWholiked
    }, "get users and likes successfully"))

});

const deleteLike = asyncHandler(async (req, res) => {
    const postId = req.params?.id;
    const userId = req.user?.id;
    await Like.findOneAndDelete({ post: postId });

    res.status(200).json(new ApiResponse(200,{},'like deleted successfully'))


})

export { postLike, getLikesAndUsersFromPost,deleteLike }