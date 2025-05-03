const { Schema, model } = require('mongoose')

const CoinSchema = new Schema({
    id: { type: String, required: true, unique: true },
    symbol: String,
    name: String,
    image: String,
    current_price: Number,
    market_cap: Number,
    market_cap_rank: Number,
    total_volume: Number,
    price_change_percentage_24h: Number,
    last_updated: String,
  
    tags: [{ type: String }], 
  }, { timestamps: true })

module.exports = model('Coin', CoinSchema)