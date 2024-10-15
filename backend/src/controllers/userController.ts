import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';

// Endpoint to retrieve all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users);
    res.json({ allUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
};
