import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        videoUrl:{
            type:String,
            required:true
        },
        thumbnailImg:{
            type:String,
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            description:true
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        duration:{
            type:Number,
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:false
        }

    },
    {timestamps:true}
)
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model('Video',videoSchema)