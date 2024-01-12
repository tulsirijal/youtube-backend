import express,{ Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
const router = Router()

router.route('/register').post(
    upload.fields(
        [{
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImg"
        }]
    ),
    registerUser
    )

export default router 