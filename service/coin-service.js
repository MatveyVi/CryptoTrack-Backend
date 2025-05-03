const axios = require('axios')
const constants = require('../utils/constants/constants')
const { handleServerError } = require('../utils/error-debug')
const CoinDbService = require('./coin.db-service')


class CoinService {
    async getTopCoins() {
        try {
            return await CoinDbService.getTopCoins(30)
        } catch (error) {
            throw error
        }

    }
    async getCoinById(id) {
        try {
            return await CoinDbService.getCoinById(id)
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


setInterval(async () => {
    try {
        await CoinDbService.updatePopular()
    } catch (error) {
        console.error('Ошибка при обновлении монет', error.message)
    }
}, 20 * 1000)
