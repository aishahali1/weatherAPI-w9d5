import { log } from 'console';
import { SignOptions } from 'jsonwebtoken';
import  jwt  from 'jsonwebtoken';
const secret = process.env.JWT_SECRET 
console.log(secret);

if (!secret) {
  throw new Error('JWT_SECRET environment variable is not defined');
}
const payload = {
  id: 'user-id-123',
  email: 'user@example.com',
  role: 'user'
};
const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15m' });

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  token: {
    options: {
      expiresIn: '15m',
      algorithm: 'HS256',
    } as SignOptions,
  }
}; 