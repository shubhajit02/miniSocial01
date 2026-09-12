import mongoose from 'mongoose'

 const connectMongoDb=async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)

    } catch (error) {
        console.log('Something went wrong will connecting to mongoDb '+error);
        process.exit(1)
    }
};

export {connectMongoDb}