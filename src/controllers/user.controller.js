import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const registerUser = async(req,res)=>{
    try {
        // get the user info from req.body
        // check if all fields are filled
        // check if the user already exists
        // register the user
        const {fullname,username,email,password} = req.body
        console.log(req.files)
        const avatar = req.files?.avatar[0]?.path
        // const coverImg = req.files?.coverImg[0]?.path

        if([fullname,username,email,password].some(element=>element?.trim()==='')){
            return res.status(400).json({
                success:"false",
                message:"All fields are required"
            })
        }
        if(!avatar){
            res.status(400).json({
                success:false,
                message:"Avatar is required"
            })
        }
        const user = await User.findOne({email:email})
        if(user){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        const avatarUrl = await uploadOnCloudinary(avatar)
        // const coverImgUrl = await uploadOnCloudinary(coverImg)
        const newUser = await new User({fullname,email,password,username,avatar:avatarUrl.secure_url})
        await newUser.save()
        const currentUser = await User.findById(newUser._id).select('-password -refreshToken')
        return res.status(200).json({
            success:true,
            message:"User successfully created",
            user:currentUser
        })

    } catch (error) {
        console.log("Error while registering the user:", error.message)
       return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export {
    registerUser
}