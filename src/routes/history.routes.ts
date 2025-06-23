import { Router } from "express";
import {userHistory} from '../controllers/history.controller'


const router = Router()

router.get('/', userHistory)

export default router; 