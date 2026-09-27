

//authentication = to check if the database know the user
//authorization = check if the user is allowed to perform this task
//if the userr is not logged in, he/she cant perform the logout
//to check if the user is logged in, we extract the accesstoken from cookie in browser and in from req.headers in mobile devices

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const checkAuth = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
    if (!accessToken) {
        throw new ApiError(401,"Accesstoken is required")
    };
    const decoded = jwt.verify(accessToken, process.env.
        ACCESS_TOKEN_SECRET_KEY);

    const user = await User.findById(decoded._id);
    if (!user) {
        throw new ApiError(401, "user does not exist")
    };

    req.user=user;
    next()
});


export {checkAuth}