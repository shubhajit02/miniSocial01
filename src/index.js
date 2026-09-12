import 'dotenv/config'

import { app } from './app.js';


const port =process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send("Hello")
})
app.listen(port,()=>console.log(`Server starts at ${port}`))
