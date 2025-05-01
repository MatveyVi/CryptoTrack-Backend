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
}
module.exports = new CoinGecko()