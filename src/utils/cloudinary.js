import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'      
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET 
});

const uploadOnCloudinary = async(filePath) =>{
    try {
        if(!filePath) return null

        const upload = await cloudinary.uploader.upload(filePath,{
            resource_type:"auto"
        })

        console.log('file uploaded',upload.url)
        return upload
    } catch (error) {
        // Remove the local file on the server
        fs.unlinkSync(filePath) 
        console.log('Error while uploading in cloudinary:',error)
        return null
    }
    
}

export {uploadOnCloudinary}