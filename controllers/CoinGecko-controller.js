const CoinService = require('../service/coin-service')
const { handleServerError } = require('../utils/error-debug')

class CoinGecko {
    async getTopCoins(req, res) {
        try {
            const page = parseInt(req.query.page || '1', 10)
            const limit = parseInt(req.query.limit || '20', 10)
            const data = await CoinService.getTopCoins(page, limit)
            res.json(data.data)
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
        const days = req.query.interval
        console.log(days)
        
        try {
            const data = await CoinService.getCoinChart(id, days)
            res.send(data)
        } catch (error) {
            handleServerError(res, error, 'getCoinChart')
        }
    }
    async getTrending(req, res) {
        try {
            const data = await CoinService.getTrending()
            res.send(data)
        } catch (error) {
            handleServerError(res, error, 'getTrending')
        }
    }   
}
module.exports = new CoinGecko()