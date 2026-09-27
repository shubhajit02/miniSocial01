import { User } from '../model/user.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { Post } from '../model/post.model.js'
import mongoose from 'mongoose'


//create a post by user
const createPost = asyncHandler(async (req, res) => {
    //get title,description from user frontend
    //check any fields are missing
    //user can post means,he is authenticated,get user from req.user
    //get file via multer
    //upload on cloudinary
    //check if something wrong while uploading
    //create post on database and give a response to client

    const { title, description } = req.body;
    // if([title,description].some(field=>field.trim()==="")){
    //     throw new ApiError(400,"all fields are required")
    // }
    if (!(title && description)) {
        throw new ApiError(400, "All fields are required")
    };

    const photoPath = req.file?.path;

    if (!photoPath) {
        throw new ApiError(400, "file is required")
    }
    //now upload on cloudinary
    const file = await uploadOnCloudinary(photoPath);
    if (!file) {
        throw new ApiError(401, "file could not upload on cloudinary")
    };

    const userId = req.user._id
    const post = await Post.create({
        title,
        description,
        owner: userId,
        file: file.url
    });
    if (!post) {
        throw new ApiError(401, "Post could not created")
    }
    res.status(200).json(new ApiResponse(200, post, "post created successfully"))


});

//get all post by the user
const getPostOfCreator = asyncHandler(async (req, res) => {
    const userId = req.params?.id;
    //check if the user exist
    const creator = await Post.findOne({ owner: userId });
    if (!creator) {
        throw new ApiError(404, "User not found")
    };

    const allPosts = await Post.find({ owner: userId });


    if (allPosts.length === 0) {
        throw new ApiError(401, "no posts found")
    };

    res.status(200).json(new ApiResponse(200, allPosts, "get all posts of the user successfully"))

})

const getPostofUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const findUserPost = await Post.find({ owner: userId });
    console.log(findUserPost.length);

    if (findUserPost.length === 0) {
        throw new ApiError(403, "No posts found")
    };

    res.status(200).json(new ApiResponse(200, findUserPost, 'fetched user data successfully'))

});

const deletePost = asyncHandler(async (req, res) => {
    const postid = req.params?.id;
    if (!postid) {
        throw new ApiError(400, "post id required")
    };
    const userid = req.user?._id;
    const userOfPost = await Post.find({
        $and: [
            { owner: userid },
            { _id: postid }
        ]
    });
    if (!userOfPost) {
        throw new ApiError(403, "The user cant delete this post")
    }

    await Post.findByIdAndDelete({ _id: postid });
    res.status(200).json(new ApiResponse(200, {}, "post deleted successfully"))

})

export { createPost, getPostOfCreator, getPostofUser, deletePost }