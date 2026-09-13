import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    avatar: {
        type: String,
        required: true
    }

}, { timestamps: true });

//user document save hoar age amake er password hash korte hbe

userSchema.pre("save", async function () {
    //ami normal function expression use korlam karon, arrow func this object k refer korte jane na(kono context nei j this ta k?)

    //kano amr this lagbe?
    //jei user document k refer kora hbe sei user e holo this
    //userSchema thekei ami this peye jabo

    if (!this.isModified("password")) return
    //user document er password field jodi change na hoy tahle kichu korar dorkar nei

    const hashedPass = await bcrypt.hash(this.password, 10);
    this.password = hashedPass
})

//kichu methods create korte pari, karon schema thke directly user er info ami this kore nite pari

userSchema.methods.comparePassword = function (password) {
    const isCorrectPass = bcrypt.compare(password, this.password);
    return isCorrectPass
};

userSchema.methods.generateAccessToken = function () {
    const payload = {
        _id: this._id,
        fullName: this.fullName,
        email: this.email,
        username: this.username

    }
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}

userSchema.methods.generateRefreshToken = function () {
    const payload = {
        _id: this._id,
        fullName: this.fullName,
        email: this.email,
        username: this.username

    }
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}

export const User = mongoose.model("User", userSchema)