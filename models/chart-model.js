const { Schema, model} = require('mongoose')

const ChartSchema = new Schema({
    coinId: { type: String, required: true },
    interval: {
      type: String,
      enum: ['1d', '7d', '30d', '90d', '1y'],
      required: true
    },
    prices: [[Number]],
    market_caps: [[Number]],
    total_volumes: [[Number]],
  }, { timestamps: true })

ChartSchema.index({ coinId: 1, interval: 1 }, { unique: true })

module.exports = model('Chart', ChartSchema)