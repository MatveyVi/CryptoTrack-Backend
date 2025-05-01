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
}
module.exports = new CoinGecko()