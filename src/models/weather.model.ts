import mongoose, { Schema, Document,ObjectId } from "mongoose";

export interface IWeather extends Document {
    lat: number
    lon: number
    data: any
    fetchedAt: Date
}

const WeatherSchema = new Schema<IWeather>({
    lat: {type: Number, required: true},
    lon: {type: Number, required: true},
    data: {type: Schema.Types.Mixed, required: true},
    fetchedAt: {type: Date, default: Date.now, required: true}
})
WeatherSchema.index({ lat: 1, lon: 1 }, { unique: true });

const Weather= mongoose.model<IWeather>('Weather', WeatherSchema)

export default Weather