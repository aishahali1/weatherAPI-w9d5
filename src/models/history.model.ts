import mongoose, { Schema,Document, ObjectId} from "mongoose";

export interface IHistory extends Document{
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
    }
)
HistorySchema.index({user: 1, requestedAt: -1})
const History = mongoose.model<IHistory>('History',HistorySchema)

export default History