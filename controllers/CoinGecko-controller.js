const axios = require('axios')

class CoinGecko {
    async get(res) {
        const response = await axios.get(`https://api.coingecko.com/api/v3/ping?x_cg_demo_api_key=${process.env.COINGECKO_KEY}`)
        res.send(response.data)
    }
}
module.exports = new CoinGecko()