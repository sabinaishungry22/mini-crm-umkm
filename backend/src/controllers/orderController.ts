import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { readDB, writeDB } from "../models/db";

export const addOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer_id, items, total_price } = req.body;

    // Validate input
    if (!customer_id || !Array.isArray(items) || typeof total_price !== "number") {
      res.status(400).json({ message: "Invalid input: customer_id, items[], and total_price are required." });
      return;
    }

    const db = await readDB();

    // Check if customer exists
    const customerExists = db.customers.find((c: any) => c.id === customer_id);
    if (!customerExists) {
      res.status(404).json({ message: "Customer not found." });
      return;
    }

    const newOrder = { id: uuidv4(), customer_id, items, total_price };
    db.orders.push(newOrder);
    await writeDB(db);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ message: "Internal Server Error while adding order." });
  }
};

export const getOrdersByCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer_id } = req.query;

    if (!customer_id || typeof customer_id !== "string") {
      res.status(400).json({ message: "Missing or invalid customer_id in query." });
      return;
    }

    const db = await readDB();
    const orders = db.orders.filter((o: any) => o.customer_id === customer_id);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error while fetching orders." });
  }
};
