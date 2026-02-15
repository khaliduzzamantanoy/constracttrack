import mongoose, { Schema, Document } from 'mongoose';

export interface IConstructionLog extends Document {
  cement: number;
  sand_fine: number;
  sand_selection: number;
  brick_chips: number;
  crane_lift: number;
  loggedBy: string;
  tier: string;
  timestamp: Date;
}

const ConstructionLogSchema: Schema = new Schema({
  cement: { type: Number, default: 0 },
  sand_fine: { type: Number, default: 0 },
  sand_selection: { type: Number, default: 0 },
  brick_chips: { type: Number, default: 0 },
  crane_lift: { type: Number, default: 0 },
  loggedBy: {
    type: String,
    required: true,
  },
  tier: {
    type: String,
    required: true,
    default: 'Ground Floor',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.ConstructionLog;
}

const ConstructionLog = mongoose.models.ConstructionLog || mongoose.model<IConstructionLog>('ConstructionLog', ConstructionLogSchema);

export default ConstructionLog;
