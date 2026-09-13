import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async function (localFilePath) {
    try {
        if (!localFilePath) {
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log(response);
        fs.unlinkSync(localFilePath)
        console.log("file uploaded successfully on cloudinary " + response.url)

        return response
    } catch (error) {

        console.error("CLOUDINARY ERROR:", error);


        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
}

export { uploadOnCloudinary }