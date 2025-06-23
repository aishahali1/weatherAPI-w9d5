import { Router } from "express";
import {weather} from '../controllers/weather.controller'


const router = Router()

router.get('/', weather as any)

export default router; 