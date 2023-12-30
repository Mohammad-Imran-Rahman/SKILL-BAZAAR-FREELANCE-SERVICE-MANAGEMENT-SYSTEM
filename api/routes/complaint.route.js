import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { uploadPhoto } from "../middleware/uploadImage.js";
import { createComplaint } from "../controllers/complaint.controller.js";

const router = express.Router();

router.post("/", verifyToken, uploadPhoto.array('photo', 5), createComplaint);

export default router;

