import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { uploadPhoto } from "../middleware/uploadImage.js";

const router = express.Router();

router.post("/register", uploadPhoto.single('photo'), register)
router.post("/login", login)
router.post("/logout", logout)

export default router;
