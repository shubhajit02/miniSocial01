import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    comment :{
        type :String,
        required:true
    }

}, { timestamps: true })

export const Comment = mongoose.model("Comment", commentSchema)