import  jwt  from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = async(req,res,next)=>{
    try {
        const accessToken = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ','')
        if(!accessToken){
            return res.status(401).json({
                success:false,
                message:"Unauthorized user"
            })
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded?._id).select('-password -refreshToken')
        if(!user) {
            return res.status(401).json({
                success:false,
                message:"Invalid access token"
            })
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error)
    }
}

export {verifyJWT}