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
            
            return await CoinDbService.getTranding()
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
        console.error('Ошибка при обновлении top монет', error.message)
    }
}, 3 * 1000) // once in 20 sec

setInterval(async () => {
    try {
        await CoinDbService.updateTrending()
    } catch (error) {
        console.error('Ошибка при обновлении trending монет', error.message)
    }
}, 5 * 1000) // once in 60 sec(for now) then switch to --> once/15min

