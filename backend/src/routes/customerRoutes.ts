import express from "express";
import { addCustomer, getCustomers } from "../controllers/customerController";

const router = express.Router();

router.post("/", addCustomer);
router.get("/", getCustomers);

export default router;
