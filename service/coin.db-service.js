const CoinModel = require('../models/coin-model')
const ChartModel = require('../models/chart-model')
const axios = require('axios')
const constants = require('../utils/constants/constants')

const freshnessByInterval = {
    '1d': 15 * 60 * 1000,
    '7d': 1 * 60 * 60 * 1000,
    '30d': 0.5 * 24 * 60 * 60 * 1000,
    '90d': 1 * 24 * 60 * 60 * 1000,
    '1y': 2 * 24 * 60 * 60 * 1000,
}
const daysToInterval = {
    1: '1d',
    7: '7d',
    30: '30d',
    90: '90d',
    365: '1y',
}


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
                        },
                        $addToSet: { tags: 'top100' }
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
    async getCoinById(id) {
        try {
            const token = await CoinModel.findOne({ id })
            if (token && token.updatedAt) {
                const timeFresh = 20 * 1000
                const isFresh = (Date.now() - token.updatedAt.getTime()) < timeFresh
                if (isFresh) {
                    console.log('Data from DB')
                    return token
                }
            }
            const response = await axios.get(`${constants.COINGECKO_BASEURL}/coins/${id}`, {
                params: {
                    localization: false,
                    tickers: false,
                    market_data: true,
                    community_data: false,
                    developer_data: false,
                    sparkline: false
                }
            })
            await CoinModel.findOneAndUpdate(
                { id: response.data.id },
                { $set: response.data },
                { upsert: true }
            )
            console.log('Data from API')
            return {
                id: response.data.id,
                symbol: response.data.symbol,
                name: response.data.name,
                image: response.data.image.large,
                description: response.data.description.en,
                current_price: response.data.market_data.current_price.usd,
                market_cap: response.data.market_data.market_cap.usd,
                price_change_24h: response.data.market_data.price_change_24h,
                price_change_percentage_24h: response.data.market_data.price_change_percentage_24h,
                ath: response.data.market_data.ath.usd,
                atl: response.data.market_data.atl.usd,
                last_updated: response.data.market_data.last_updated,
            }
        } catch (error) {
            throw error
        }
    }
    async updateTrending() {
        try {
            await CoinModel.deleteMany({
                tags: { $size: 1, $all: ['trending'] }
            })
            const response = await axios.get(`${constants.COINGECKO_BASEURL}/search/trending`, {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 15,
                    page: 1
                }
            })
            const rawCoins = response.data.coins
            const coins = rawCoins.map(c => c.item) // из-за отличий структуры получаемых данных в отличае от updatePopular

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
                        },
                        $addToSet: { tags: 'trending' }
                    },
                    upsert: true
                }
            }))

            await CoinModel.bulkWrite(operations)
            console.log('Trending обновлены')
        } catch (error) {
            throw error
        }
    }
    async getTrending() {
        try {
            const trending = await CoinModel.find({ tags: 'trending' })
            console.log(trending.length)
            return trending
        } catch (error) {
            throw error
        }
    }
    async getCoinChart(id, days) {
        try {
            const interval = daysToInterval[days]
            const token = await ChartModel.findOne({ coinId: id, interval })
            // console.log(token)
            if (token && token.updatedAt) {
                const freshnessLimit = freshnessByInterval[interval]
                console.log(freshnessLimit)
                const isFresh = (Date.now() - token.updatedAt.getTime()) < freshnessLimit
                if (isFresh) {
                    console.log('Data from DB')
                    return token
                }
            }
            const response = await axios.get(`${constants.COINGECKO_BASEURL}/coins/${id}/market_chart`, {
                params: {
                    vs_currency: 'usd',
                    days
                }
            })
            if (!interval) {
                throw new Error(`Unsupported days value: ${days}`)
            }
            const ChartData = {
                coinId: id,
                interval,
                prices: response.data.prices,
                market_caps: response.data.market_caps,
                total_volumes: response.data.total_volumes,
                updatedAt: new Date()
            }
            await ChartModel.findOneAndUpdate(
                { coinId: id, interval },
                { $set: ChartData },
                { upsert: true }
            )
            console.log('Data from API')

            return response.data
        } catch (error) {
            throw error
        }
    }
}

module.exports = new CoinDbService()