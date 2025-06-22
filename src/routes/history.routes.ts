import { Router } from "express";
import {userHistory} from '../controllers/history.controller'


const router = Router()

router.get('/history', userHistory)

export default router; 