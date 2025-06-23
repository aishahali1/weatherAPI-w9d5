import { Request, Response, NextFunction } from 'express';
import  UserCollection, {UserDocument}  from '@/models/user.model';
import {  UNAUTHORIZED, NOT_FOUND,BAD_REQUEST } from '../utils/http-status';
import { verifyToken } from '../controllers/auth.controller';

export interface authRequest extends Request {
  user: UserDocument;
}

export const authorized = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token){
        res.status(UNAUTHORIZED).json({message: 'invalid token'})
        return
      }
     const decoded = verifyToken(token)
     if(!decoded){
        res.status(UNAUTHORIZED).json({message: 'invalid token'})
        return
     }

     const user = await UserCollection.findById(decoded.id)
     if(!user){
        res.status(NOT_FOUND).json({message: 'user not found'})
        return
     }
     req.user = user 
     next()
  } catch (e: any) {
     res.status(BAD_REQUEST).json({message: e.message})
  }
}

