import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
  materialId: {
    type: String,
    required: true,
    enum: ['cement', 'sand_fine', 'sand_selection', 'brick_chips'],
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Stock || mongoose.model('Stock', StockSchema);
