import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, intent, confirm, placeOrder, handleStatus, getOrderDetails } from "../controllers/order.controller.js";
import { uploadPhoto } from "../middleware/uploadImage.js";

const router = express.Router();

router.route("/:id").get(verifyToken, getOrderDetails);
router.get("/", verifyToken, getOrders);
router.post("/:id", verifyToken, placeOrder);
router.route('/:id').put(verifyToken, uploadPhoto.single('work'), handleStatus)
router.post("/payment/:id", verifyToken, intent)
router.route("/").put(verifyToken, confirm);

export default router;
