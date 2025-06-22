import mongoose, { Schema, Document,ObjectId } from "mongoose";

export interface IWeather extends Document {
    _id: ObjectId
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
},
{
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      return {
        id: ret._id.toString(),
        lat: ret.lat,
        lon: ret.lon,
        data: ret.data,
        fetchedAt: ret.fetchedAt,
        createdAt: ret.createdAt,
        updatedAt: ret.updatedAt,
      };
    }
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      return {
        id: ret._id.toString(),
        lat: ret.lat,
        lon: ret.lon,
        data: ret.data,
        fetchedAt: ret.fetchedAt,
        createdAt: ret.createdAt,
        updatedAt: ret.updatedAt,
      };
    }
  }
}
)

WeatherSchema.index({fetchedAt: 1},{expireAfterSeconds: 3600})

const Weather= mongoose.model<IWeather>('Weather', WeatherSchema)

export default Weather