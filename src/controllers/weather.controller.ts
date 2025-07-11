import { Request, Response } from 'express';
import Weather from '../models/weather.model';
import History from '../models/history.model';
import axios from 'axios';
import {BAD_REQUEST} from '../utils/http-status'
import {AppError} from '../utils/errors'
import { authRequest } from '../middleware/auth.middleware';

export const weather = async (req: authRequest, res: Response): Promise<void> => {
 try{
    const {lat, lon} = req.query
    const latNumber = parseFloat(lat as string)
    const lonNumber = parseFloat(lon as string)
    const roundLat = parseFloat(latNumber.toFixed(2))
    const roundLon = parseFloat(lonNumber.toFixed(2))

    let getWeather = await Weather.findOne({lat: roundLat, lon: roundLon})
    if(!getWeather){
        const ApiWeather = await weatherFetch(latNumber,lonNumber)
        getWeather = await Weather.create({lat: roundLat, lon: roundLon, data: ApiWeather})
    }
    await History.create({user: req.user.id, weather: getWeather._id, lat: latNumber, lon: lonNumber })
    res.json(getWeather.data)
 }catch (e: any){
        throw new AppError(`fetch weather fail error: ${e.message}`, BAD_REQUEST);
 }
}

const weatherFetch = async (lat: number, lon: number)=>{
    const apiKEY = process.env.OPENWEATHER_API_KEY
    const roundLat = parseFloat(lat.toFixed(2))
    const roundLon = parseFloat(lon.toFixed(2))
    if(!apiKEY){
        throw new AppError('Invalid OpenWeather apikey', BAD_REQUEST);
    }

    const url=`https://api.openweathermap.org/data/2.5/weather?lat=${roundLat}&lon=${roundLon}&appid=${apiKEY}&units=metric`
    try{
        const res = await axios.get(url)
        return res.data
    } catch(e: any){
        throw new AppError(`fetch weather fail error: ${e.message}`, BAD_REQUEST);
    }
} 