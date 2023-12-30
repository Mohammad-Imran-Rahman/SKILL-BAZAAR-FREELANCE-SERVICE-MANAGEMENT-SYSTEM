import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createReview,
  getReviews,
  deleteReview,
  CheckUser,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", verifyToken, createReview )
router.get("/:gigId", getReviews )
router.delete("/:id", deleteReview)
router.get("/check/:id", verifyToken, CheckUser )

export default router;
