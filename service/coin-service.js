const axios = require('axios')
const constants = require('../utils/constants/constants')
const { handleServerError } = require('../utils/error-debug')
const CoinDbService = require('./coin.db-service')


class CoinService {
    async getTopCoins(page, limit) {
        try {
            return await CoinDbService.getTopCoins(page, limit)
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
            return await CoinDbService.getCoinChart(id, days)
        } catch (error) {
            throw error
        }
    }
    async getTrending() {
        try {
            return await CoinDbService.getTrending()
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
}, 20 * 1000) // once in 20 sec

setInterval(async () => {
    try {
        await CoinDbService.updateTrending()
    } catch (error) {
        console.error('Ошибка при обновлении trending монет', error.message)
    }
}, 15 * 60 * 1000) // once in 60 sec(for now) then switch to --> once/15min

