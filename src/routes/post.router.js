import express from 'express'
import { createPost ,getPostOfCreator,getPostofUser ,deletePost} from '../controller/post.controller.js';
import { checkAuth} from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js'

const router=express.Router();

router.route('/create-post').post(checkAuth,upload.single('photo'),createPost)

router.route('/user/:id/allposts').get(checkAuth,getPostOfCreator )

router.route('/user/all-posts').get(checkAuth,getPostofUser)
router.route('/:id/delete').delete(checkAuth,deletePost)

export default router