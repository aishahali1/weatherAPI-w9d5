import { Router } from "express";
import {weather} from '../controllers/weather.controller'
import { authorized } from "../middleware/auth.middleware";


const router = Router()

router.get('/', authorized ,weather)

export default router; 