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
const login = async(req,res)=>{
    try {
        // get the user info from req.body
        // check if all fields are filled
        // check if the user already exists
        // if exists, match the password
        // generate access and refresh token
        // create cookie 
        // send response
        const {email,password} = req.body

        if(!email && !password){
            return res.status(400).json({
                success:"false",
                message:"All fields are required"
            })
        }
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User doesn't exists"
            })
        }
        const isPasswordCorrect = await user.checkPassword(password)
        if(!isPasswordCorrect){
            return res.status(401).json({
                success:false,
                message:"Incorrect password"
            })
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        const loggedInUser = await User.findById(user._id).select('-password -refreshToken')
        const options = {
            httpOnly:true,
            secure:true
        }

        return res.status(200).cookie('accessToken',accessToken,options).cookie('refreshToken',refreshToken,options).json({
            success:true,
            message:"Successfully logged in",
            accessToken,refreshToken,
            user:loggedInUser
        })

    } catch (error) {
        console.log("Error while registering the user:", error.message)
       return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

const logout = async(req,res)=>{
    try {
        const user = req.user
        const loggedInUser = await User.findById(user._id)
        loggedInUser.refreshToken = undefined
        await loggedInUser.save({validateBeforeSave:false})
        const options = {
            httpOnly:true,
            secure:true
        }
        res.status(200).clearCookie('accessToken',options).clearCookie('refreshToken', options).json({
            message:"Logged out",
            success:true
        })
    } catch (error) {
        console.log('Error while logging out', error.message)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


export {
    registerUser,login,logout
}