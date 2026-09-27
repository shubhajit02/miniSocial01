import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js';
import {createComment,getComment,updateComment,deleteComment} from '../controller/comment.controller.js'
const router=express.Router();

//create comment
router.route('/:id/create-comment').post(checkAuth,createComment)

//get comments
router.route('/:id/get-comments').get(checkAuth,getComment)

//update comment
router.route('/:id/update-comment').patch(checkAuth,updateComment)

//delete commnets
router.route('/:id').delete(checkAuth,deleteComment)

export default router