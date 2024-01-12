import express, { Router } from "express";
import { login, logout, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import {verifyJWT} from '../middlewares/authMiddleware.js'
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImg",
    },
  ]),
  registerUser
);

router.route('/login').post(login)
router.route('/logout').post(verifyJWT,logout)

export default router;
