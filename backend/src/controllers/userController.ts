import { Request, Response } from 'express';
import { db } from '../db';
import { spaces, users } from '../db/schema';
import { eq } from 'drizzle-orm';

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

export const getAllSpacesByUser = async (req: Request, res: Response) => {

  try {
    const { userId : curUserId,email : curUserEmail } = req.query
    
    if(curUserEmail != req.user.email) {
      console.log('cur email : ',curUserEmail)
      console.log('',req.user.email)
      res.json({
        message : 'Unauthorized',
      })
      return;
    }

    const allSpaces = await db.select().from(spaces).where(eq(spaces.userId, Number(curUserId)));

    res.json({
      message: 'Success',
      userSpace: allSpaces
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || error, 
      message: 'Error retrieving spaces'
    });
  }
};
