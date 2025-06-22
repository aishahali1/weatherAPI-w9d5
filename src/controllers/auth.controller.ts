import { NextFunction, Request,Response } from "express";
import {AppError} from '../utils/errors'
import { dev } from '../utils/helpers';
import { CREATED, OK, BAD_REQUEST, UNAUTHORIZED} from '../utils/http-status';
import { UserDocument, UsersCollection } from "../models/user.model";
import { jwtConfig } from '../config/jwt'
import  jwt  from "jsonwebtoken";
import bcrypt from 'bcryptjs'

const signUp = async (req: Request, res: Response, next: NextFunction) =>{
     console.log('Signup route hit');
    try{
        const {email, password} = req.body
        const existingUser = await UsersCollection.findOne({ email })
        if (existingUser) {
        throw new AppError('Email already exists', BAD_REQUEST) }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await UsersCollection.create({email, passwordHash});
        const { token } = await generateTokens(user);

        res.cookie('token', token,{
            httpOnly: true,
            secure: !dev,
            maxAge: 7*24*60*60*1000,
        })
        res.status(CREATED).json({
            status: 'success',
            data:{
             id: user.id,
             email: user.email,
             role: user.role,
             createdAt: user.createdAt,
             updatedAt: user.updatedAt
            },
            token
        })

    }catch (e){
      console.error('Signup error:', e)
    }
}

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

     const user = await UsersCollection.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', UNAUTHORIZED);
  }
  const { token } = await generateTokens(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: !dev,
      maxAge: 15 * 60 * 1000,
    })

    res.status(OK).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token
      }
    })
  } catch (e) {
    next(e)
  }
}

const signOut = async (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  })
  res.status(OK).json({
    status: 'success',
    message: 'Signed out successfully',
  })
}
const generateTokens = async (
  user: UserDocument
): Promise<{ token: string}> => {
  const token = jwt.sign(
    {
      type: 'access',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    },
    jwtConfig.secret,
    jwtConfig.token.options
  );
  return {token};
}

export {
  signUp,
  signIn,
  signOut
}