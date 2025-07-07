import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { readDB, writeDB } from "../models/db";

export const addCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({ message: "Name, email, and phone are required." });
      return;
    }

    const db = await readDB();
    const newCustomer = { id: uuidv4(), name, email, phone };

    db.customers.push(newCustomer);
    await writeDB(db);

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ message: "Internal Server Error while adding customer." });
  }
};

export const getCustomers = async (_: Request, res: Response): Promise<void> => {
  try {
    const db = await readDB();
    res.status(200).json(db.customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Internal Server Error while fetching customers." });
  }
};
