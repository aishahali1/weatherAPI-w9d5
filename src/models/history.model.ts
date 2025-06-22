import mongoose, { Schema,Document, ObjectId} from "mongoose";

export interface IHistory extends Document{
    _id: ObjectId
    user: ObjectId
    weather: ObjectId
    lat: number
    lon: number
    requestedAt: Date
}

const HistorySchema: Schema<IHistory> = new Schema<IHistory>(
    {
      user: {type: Schema.Types.ObjectId, ref: 'User', index: true, required: true},
      weather: {type: Schema.Types.ObjectId, ref: 'Weather', required: true},
      lat: {type: Number, required: true},
      lon: {type: Number, required: true},
      requestedAt:{type: Date, default: Date.now, index: true, required: true}
    },
    {
    timestamps: true,
    id: false,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        return {
          id: ret._id.toString(),
          user: ret.user,
          weather: ret.weather,
          lat: ret.lat,
          lon: ret.lon,
          requestedAt: ret.requestedAt,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        }
      }
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        return {
          id: ret._id.toString(),
          user: ret.user,
          weather: ret.weather,
          lat: ret.lat,
          lon: ret.lon,
          requestedAt: ret.requestedAt,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        }
      }
    }
}
)

const History = mongoose.model<IHistory>('History',HistorySchema)

export default History