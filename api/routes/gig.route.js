import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import { uploadPhoto } from "../middleware/uploadImage.js";

const router = express.Router();

router.post("/", verifyToken, uploadPhoto.array('photo', 5), createGig);
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", getGig);
router.get("/", getGigs);

export default router;
