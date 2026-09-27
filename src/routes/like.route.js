import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js';
import { postLike ,getLikesAndUsersFromPost, deleteLike} from '../controller/like.controller.js';
const router=express.Router();

//create like
router.route('/:id/create').post(checkAuth,postLike);

//get all likes and users
router.route('/:id/get-likes').get(checkAuth,getLikesAndUsersFromPost)

//delete like
router.route('/:id/deleteLike').delete(checkAuth,deleteLike)

export default router