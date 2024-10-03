import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { generateJWT } from '../utils/jwt';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import oauth2Client from '../config/googleClient';

// Google authentication and JWT generation
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

    let user: any = await db.select().from(usersTable).where(eq(usersTable.email, email));
    let userId;

    if (!user || user.length === 0) {
      const insertedUser = await db.insert(usersTable).values({ name, email }).returning({ userId: usersTable.id });
      userId = insertedUser[0]?.userId;
      user = { userId, name, email };
    } else {
      userId = user[0].id;
    }

    const customToken = generateJWT({ userId, email, name, pictureUrl });
    res.json({ message: 'Success', token: customToken, user: { userId, email, name, pictureUrl } });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ errorMessage: 'Unauthorized' });
  }
};
