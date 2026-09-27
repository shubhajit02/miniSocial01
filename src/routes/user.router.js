import express from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { getAccessTokenByRefreshToken, getUser, updateUserEmailAndUsername, updateUserPassword, userLogin, userLogout, userRegister } from '../controller/user.controller.js'
import { checkAuth } from '../middlewares/auth.middleware.js';



const router = express.Router();

router.route('/register').post(upload.single('avatar'), userRegister)
router.route('/login').post(userLogin);
router.route('/logout').post(checkAuth,userLogout)
router.route('/:id').get(checkAuth,getUser);
router.route('/updatePassword').patch(checkAuth,updateUserPassword);
router.route('/update-details').patch(checkAuth,updateUserEmailAndUsername)

router.route('/refresh').post(getAccessTokenByRefreshToken)

export default router