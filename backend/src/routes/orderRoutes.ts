import express from "express";
import { addOrder, getOrdersByCustomer } from "../controllers/orderController";
const router = express.Router();

router.post("/", addOrder);
router.get("/", getOrdersByCustomer);

export default router;