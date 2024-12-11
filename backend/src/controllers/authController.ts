import { Request, Response } from 'express';
import { generateTokens, verifyToken } from '../utils/jwt';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import oauth2Client from '../config/googleClient';

export const googleAuth = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ errorMessage: 'Token is required' });
  }

  try {
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid token payload');
    }

    const { sub, email, name, picture: pictureUrl } = payload;

    if (!email) {
      return res.status(400).json({ errorMessage: 'Email not found in token' });
    }

    let user = await db.select().from(users).where(eq(users.email, email))


    if (!user || user.length === 0) {
      const { accessToken } = generateTokens({ sub, email, name });
      const insertedUser = await db.insert(users).values({ name, email }).returning()
      user = insertedUser;

      res.json({
        message: 'User created',
        accessToken,
        user: { userId: user[0].userId, email, name, pictureUrl }
      });
    } else {
      
      const { accessToken } = generateTokens({ userId: user[0].userId, email, name });

      res.json({
        message: 'Success',
        accessToken,
        user: { userId: user[0].userId, email, name, pictureUrl }
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ errorMessage: 'Unauthorized' });
  }
};

