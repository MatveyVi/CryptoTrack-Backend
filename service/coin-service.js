const axios = require('axios')
const constants = require('../utils/constants/constants')

class CoinService {
    async getTopCoins() {
        try {
            console.log(`${constants.COINGECKO_BASEURL}/coins/markets`)
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
            //console.log('Error fetching top coins:', error.response ? error.response.data : error.message);
        }
        
    }
}

module.exports = new CoinService()