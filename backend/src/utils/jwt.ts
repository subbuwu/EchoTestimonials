import jwt from 'jsonwebtoken';

export const generateTokens = (payload: object) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET ?? '', { expiresIn: 86400 });
  return { accessToken };
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};