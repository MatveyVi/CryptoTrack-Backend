const CoinModel = require('../models/coin-model')
const axios = require('axios')
const constants = require('../utils/constants/constants')

class CoinDbService {
    async updatePopular() {
        try {
            const response = await axios.get(`${constants.COINGECKO_BASEURL}/coins/markets`, {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 100, // 100 монет на странице
                    page: 1,      // первая страница
                    sparkline: false
                },
                // headers: {
                //     'x-cg-pro-api-key': constants.COINGECKO_KEY
                // }
            })
            const coins = response.data

            const operations = coins.map((coin) => ({
                updateOne: {
                    filter: { id: coin.id },
                    update: {
                        $set: {
                            symbol: coin.symbol,
                            name: coin.name,
                            image: coin.image,
                            current_price: coin.current_price,
                            market_cap: coin.market_cap,
                            market_cap_rank: coin.market_cap_rank,
                            total_volume: coin.total_volume,
                            price_change_percentage_24h: coin.price_change_percentage_24h,
                            last_updated: new Date(),
                            tags: ['top100']
                        }
                    },
                    upsert: true
                }
            }))

            await CoinModel.bulkWrite(operations)
            console.log('Топ100 обновлены')
        } catch (error) {
            throw error
        }
    }
    async getTopCoins(num) {
        try {
            return await CoinModel.find({ tags: 'top100' }).sort({ market_cap_rank: 1 }).limit(num)
        } catch (error) {
            throw error
        }
    }
}

module.exports = new CoinDbService()