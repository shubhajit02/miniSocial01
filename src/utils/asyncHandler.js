//asyncHandler is used to catch the error, so that the code dont burst

const asyncHandler = function (requesthanlder) {
    return async (req, res, next) => {
        try {

            await requesthanlder(req, res, next)//call the controller function, wait for the promise, because it talks with database, if anything wrong catch the error
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
};

export {asyncHandler}

// const asyncHandler2=(fn)=>{
//     return (req,res,next)=>{
//         Promise.resolve(fn(req,res,next)).catch(next)
//     }
// }