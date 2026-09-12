import 'dotenv/config'

import { app } from './app.js';
import { connectMongoDb } from './db/connectMongoDb.js';

connectMongoDb().then(()=>console.log("mongoDb connected")).catch((err)=>console.log("MONGODB CONNECTION FAILED :"+err))
const port =process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send("Hello")
})
app.listen(port,()=>console.log(`Server starts at ${port}`))
