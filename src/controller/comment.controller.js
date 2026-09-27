import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from '../model/comment.model.js'

//create commnent

const createComment = asyncHandler(async (req, res) => {
    //need post id
    //need userid
    const postId = req.params?.id;
    const userid = req.user._id;
    const { comment } = req.body;


    if (!postId) {
        throw new ApiError(404, "post not found")
    }
    if (!comment) {
        throw new ApiError(403, "comment required")
    }

    const commentPost = await Comment.create({
        owner: userid,
        post: postId,
        comment: comment.trim()
    });

    if (!commentPost) {
        throw new ApiError(404, "comment is not created")
    };

    res.status(200).json(new ApiResponse(200, commentPost, "comment created successfully"))

});

const getComment = asyncHandler(async (req, res) => {
    const postId = req.params?.id;
    const userId = req.user?.id;
    if (!postId) {
        throw new ApiError(403, "no post id found")
    };

    const allComments = await Comment.find({ post: postId });
    if (allComments.length === 0) {
        throw new ApiError(403, "can't get any comments")
    };

    res.status(200).json(new ApiResponse(200, {
        comments: allComments
    }, "get all comments successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    const commentId = req.params?.id;
    const userId = req.user?._id;
    const { newComment } = req.body;

    if (!newComment) {
        throw new ApiError(403, "no new comment found")
    }

    const checkUserOfTheComment = await Comment.find({
        $and: [{ owner: userId }, { _id: commentId }]
    });
    if (!checkUserOfTheComment) {
        throw new ApiError(403, "You can't change this comment")
    };

    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
        $set: { comment: newComment.trim() }
    });

    if (!updateComment) {
        throw new ApiError(403, "no new comment CREATED")
    };

    res.status(200).json(new ApiResponse(200, newComment, "comment updated successfully"))

});

const deleteComment=asyncHandler(async(req,res)=>{
    const commnentId=req.params?.id;

      if (!commnentId) {
        throw new ApiError(403, "no comment id found")
    };

    const commentByUser=await Comment.find({
        $and:[{owner : req.user._id},{comment : commnentId}]
    });
console.log(commentByUser);

    if(commentByUser.length===0){
        throw new ApiError(404,"comment is not by user")
    }

    await Comment.findByIdAndDelete(commnentId);
    res.status(200).json(new ApiResponse(200,{},"comment deleted successfully"))
})

export { createComment, updateComment,getComment,deleteComment }