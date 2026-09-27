//mini app
//all app configuration

import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/user.router.js'
import postRouter from './routes/post.router.js'
import likeRouter from './routes/like.route.js'
import commentRouter from './routes/comment.route.js'

const app=express();

app.use(express.urlencoded({extended:false}));

app.use(express.json());

//parse the cookie
app.use(cookieParser())

//cors(cross-origin resourse sharing)
app.use(cors({
    origin: "http://localhost:5173",
    credentials :true
}))


//user router
app.use('/api/v1/user',userRouter)

//post router
app.use('/api/v1/posts',postRouter)

//like router
app.use('/api/v1/like',likeRouter)

//comment router
app.use('/api/v1/comments',commentRouter)

app.get('/',(req,res)=>{
    res.send('Hii')
})
export {app}