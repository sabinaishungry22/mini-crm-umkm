import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { readDB, writeDB } from "../models/db";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export const addCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone } = req.body;

    // Validate input
    if (!name || !email || !phone) {
      res.status(400).json({ 
        message: "Missing required fields: name, email, and phone are required." 
      });
      return;
    }

    // Simple email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    const db = await readDB();
    
    // Check for existing email (optional but recommended)
    const emailExists = db.customers.some((c: Customer) => c.email === email);
    if (emailExists) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    const newCustomer: Customer = { 
      id: uuidv4(), 
      name, 
      email, 
      phone 
    };

    db.customers.push(newCustomer);
    await writeDB(db);

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ 
      message: "Internal Server Error while adding customer." 
    });
  }
};

export const getCustomers = async (_: Request, res: Response): Promise<void> => {
  try {
    const db = await readDB();
    res.status(200).json(db.customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ 
      message: "Internal Server Error while fetching customers." 
    });
  }
};