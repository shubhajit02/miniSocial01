//mini app
//all app configuration

import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

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





export {app}