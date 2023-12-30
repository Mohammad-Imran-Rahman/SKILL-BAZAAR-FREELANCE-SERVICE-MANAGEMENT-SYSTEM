import express from "express";
import {
  createChat,
  getConversations,
  getSingleConversation,
  updateConversation
} from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createChat);
router.get("/", verifyToken, getConversations);
router.get("/single/:id", verifyToken, getSingleConversation);
router.put("/:id", verifyToken, updateConversation);

export default router;
