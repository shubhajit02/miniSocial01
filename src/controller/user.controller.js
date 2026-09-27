import { User } from '../model/user.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import jwt from 'jsonwebtoken'


const generateAccessAndRefreshToken = (user) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return { accessToken, refreshToken }
}

const userRegister = asyncHandler(async (req, res) => {
    const { username, email, password, fullName } = req.body;
    if ([username, email, password, fullName].some((field) => {
        field?.trim() === ""
    })) {
        throw new ApiError(400, "All fields are required")
    }

    const userExist = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (userExist) {
        throw new ApiError(401, "User already exist")
    }

    const avatarFilePath = req.file?.path;
    if (!avatarFilePath) {
        throw new Error(401, "Avatar file is required")
    };
    const avatar = await uploadOnCloudinary(avatarFilePath);
    if (!avatar) {
        throw new ApiError(401, "Avatar is not uploaded on cloudinary")
    };
    const newuser = await User.create({
        fullName: fullName,
        username,
        email,
        password,
        avatar: avatar.url

    });
    if (!newuser) {
        throw new ApiError(500, "User is not created")
    };
    const user = await User.findOne({ email }).select("-password")

    res.status(201).json(new ApiResponse(201, newuser, "User created successfully"))

})


const userLogin = asyncHandler(async (req, res) => {
    //get username or email and password from frontend
    //check if those fields are empty
    //check if those fields are in database
    //if not , then give an error to register first
    //if exist,then check the password with hashed password
    //generate the access and refreshToken 
    //then send it through cookie

    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(401, "email and  password required")
    };

    const userExist = await User.findOne({ email });
    if (!userExist) {
        throw new ApiError(401, "no user found, please register")
    }
    const checkPassword = await userExist.comparePassword(password);
    console.log(checkPassword);

    if (checkPassword === false) {
        throw new ApiError(401, "Incorrect password")
    };

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(userExist);



    if (!(accessToken && refreshToken)) {
        throw new ApiError(401, "no access and refreshToken are generated")
    };

    const user = await User.findById(userExist._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, user, "user logged in successfully"))

})

const userLogout = asyncHandler(async (req, res) => {
    const user = req.user;
    res.status(200).clearCookie("accessToken").json(new ApiResponse(200, {}, "user logged out successfully"))
})


const getUser = asyncHandler(async (req, res) => {
    const userId = req.params?.id;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User does not exist")
    };
    res.status(200).json(new ApiResponse(200, user, "get user successfully"))

})

//update user's email , username ,password
const updateUserPassword = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword && !newPassword) {
        throw new ApiError(401, "passwords are required")
    };
    const user = await User.findById(userId);

    //check if the oldPassword is correct
    const checkPass = await user.comparePassword(oldPassword);

    if (checkPass === false) {
        throw new ApiError(401, "oldpassword is wrong")
    };

    //now hashing the new password
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, {}, "password updated successfully"))


})

const updateUserEmailAndUsername=asyncHandler(async(req,res)=>{
    const {email,username}=req.body;
    if(!email && !username){
        throw new ApiError(401,"email and username is required");
    }
    const userId=req.user?._id;
    const user=await User.findByIdAndUpdate(userId,{
        $set:{
            email,
            username
        }
    }).select("-password -refreshToken");

    res.status(200).json(new ApiResponse(200,{},"email and username updated successfully"))

})

const getAccessTokenByRefreshToken=asyncHandler(async(req,res)=>{
  //If someone logout and want to login again and get accesstoken that could be via refreshToken
  //I get the refreshtoken from cookies 
  //when user logout I only clear cookie of accesstoken, butnot refreshToken

  const refreshToken=req.cookies?.refreshToken;
//verify the token
if(!refreshToken){
    throw new ApiError(401,"Cant get refresh token")
}
const decodedUserInfo=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET_KEY);
if(!decodedUserInfo){
    throw new ApiError(401,"refreshToken does not decoded")
};

const user=await User.findById(decodedUserInfo._id).select("-password -refreshToken")
if(!user){
    throw new ApiError(401,"User not found")
};

const {accessToken}=generateAccessAndRefreshToken(user);


const options={
    httpOnly:true,
    secure:true
};



res.status(200).cookie("accessToken",accessToken,options).json(new ApiResponse(200,user,"user successfully login via token"))

})

export { userRegister, userLogin, userLogout, getUser,updateUserPassword,updateUserEmailAndUsername ,getAccessTokenByRefreshToken}