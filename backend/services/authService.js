import jwt from 'jsonwebtoken'

export const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 24 * 60 * 60 // 1 day in seconds
  });
};