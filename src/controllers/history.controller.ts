import { Request, Response } from 'express';
import History from '../models/history.model';
import {BAD_REQUEST} from '../utils/http-status'
import {AppError} from '../utils/errors'


export const userHistory = async (req: Request, res: Response): Promise<void> =>{
try{
const userID = req.body.id
const getHistory = await History.find({user: userID}).populate('weather').sort({requestedAt: -1})
res.json(getHistory)
}catch (e: any){
throw new AppError(`fetch history fail error: ${e.message}`, BAD_REQUEST);
}
}