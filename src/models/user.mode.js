import mongoose,{Schema} from "mongoose";
import { jwt } from "jsonwebtoken";
import bcrypt from 'bcrypt'
const userSchema = new Schema(
    {
        fullname:{
            type:String,
            required:true,
            trim:true

        },
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        password:{
            type:String,
            required:true,
        },
        avatar:{
            type:String,
        },
        coverImg:{
            type:String
        },
        refreshToken:{
            type:String
        },
        watchHistory:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }]
    },
    {timestamps:true}
)

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    try {
        this.password = await bcrypt.hash(this.password,10)
        next()
    } catch (error) {
        console.log('Error while password encryption:' , error)
    }
})

userSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password,this.password)
} 


userSchema.methods.generateAccessToken = function(){
    return  jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        }
        ,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return  jwt.sign(
        {
            _id:this._id,
        }
        ,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User',userSchema)