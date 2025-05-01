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
            return response.data

        } catch (error) {
            throw error
        }
    }
}

module.exports = new CoinService()