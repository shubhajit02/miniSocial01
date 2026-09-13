import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    file: {
        type: String,
        required: true
    },
    like: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like"
    },
     comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }

}, { timestamps: true });

export const Post = mongoose.model("Post", postSchema)