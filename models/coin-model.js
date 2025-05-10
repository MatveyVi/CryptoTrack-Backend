const { Schema, model } = require('mongoose')

const CoinSchema = new Schema({
    id: { type: String, required: true, unique: true },
    symbol: String,
    name: String,
    image: Schema.Types.Mixed,
    current_price: Number,
    market_cap: Number,
    market_cap_rank: Number,
    total_volume: Number,
    price_change_percentage_24h: Number,
    high_24h: Number,
    low_24h: Number,
    circulating_supply: Number,
    max_supply: Number,
    last_updated: String,
  
    tags: [{ type: String }], 
  }, { timestamps: true })

module.exports = model('Coin', CoinSchema)