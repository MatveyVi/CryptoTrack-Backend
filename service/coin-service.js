const axios = require('axios')
const constants = require('../utils/constants/constants')
const { handleServerError } = require('../utils/error-debug')

class CoinService {
    async getTopCoins() {
        try {
            const response = await axios.get(`${constants.COINGECKO_BASEURL}/coins/markets`, {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 30, // 30 монет на странице
                    page: 1,      // первая страница
                    sparkline: false
                }
            })
            return response.data

        } catch (error) {
            throw error
        }

    }
    async getCoinById(id) {
        try {
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
    async getCoinChart(id, days = '1') {
        try {
            const response = await axios.get(`${constants.COINGECKO_BASEURL}/coins/${id}/market_chart`, {
                params: {
                    vs_currency: 'usd',
                    days: days
                }
            })
            return response.data.prices
        } catch (error) {
            throw error
        }
    }
    async getTranding() {
        try {
            const response = await axios.get(`${constants.COINGECKO_BASEURL}/search/trending`, {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 15,
                    page: 1
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    }
}

module.exports = new CoinService()