const CoinService = require('../service/coin-service')
const { handleServerError } = require('../utils/error-debug')

class CoinGecko {
    async getTopCoins(req, res) {
        try {
            const data = await CoinService.getTopCoins()
            res.json(data)
        } catch (error) {
            handleServerError(res, error, 'getTopCoins')
        }
    }
    async getCoinById(req, res) {
        const { id } = req.params;
        try {
            const data = await CoinService.getCoinById(id)
            res.json(data)
        } catch (error) {
            handleServerError(res, error.message, 'getCoinById')
        }
    }
    async getCoinChart(req, res) {
        const { id } = req.params
        const { days } = req.query
        try {
            const data = await CoinService.getCoinChart(id, days)
            res.send(data)
        } catch (error) {
            handleServerError(res, error, 'getCoinChart')
        }
    }
    async getTranding(req, res) {
        try {
            const data = await CoinService.getTranding()
            res.send(data)
        } catch (error) {
            handleServerError(res, error, 'getTranding')
        }
    }   
}
module.exports = new CoinGecko()