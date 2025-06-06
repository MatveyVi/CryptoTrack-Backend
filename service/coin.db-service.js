const CoinModel = require('../models/coin-model');
const ChartModel = require('../models/chart-model');
const axios = require('axios');
const constants = require('../utils/constants/constants');

const freshnessByInterval = {
  '1d': 15 * 60 * 1000,
  '7d': 1 * 60 * 60 * 1000,
  '30d': 0.5 * 24 * 60 * 60 * 1000,
  '90d': 1 * 24 * 60 * 60 * 1000,
  '1y': 2 * 24 * 60 * 60 * 1000,
};

const daysToNum = {
  '1d': 1,
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 365,
};

const mapCoinData = (coin) => ({
  id: coin.id,
  symbol: coin.symbol,
  name: coin.name,
  image: coin.image,
  current_price: coin.current_price,
  market_cap: coin.market_cap,
  market_cap_rank: coin.market_cap_rank,
  total_volume: coin.total_volume,
  price_change_percentage_24h: coin.price_change_percentage_24h,
  high_24h: coin.high_24h,
  low_24h: coin.low_24h,
  circulating_supply: coin.circulating_supply,
  max_supply: coin.max_supply,
  last_updated: coin.last_updated || new Date(),
});

class CoinDbService {
  async updatePopular() {
    try {
      const response = await axios.get(`${constants.COINGECKO_BASEURL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      });

      const coins = response.data;

      const operations = coins.map((coin) => ({
        updateOne: {
          filter: { id: coin.id },
          update: {
            $set: mapCoinData(coin),
            $addToSet: { tags: 'top100' },
          },
          upsert: true,
        },
      }));

      await CoinModel.bulkWrite(operations);
      console.log('Топ100 обновлены');
    } catch (error) {
      throw error;
    }
  }

  async getTopCoins(page, limit) {
    try {
      const skip = (page - 1) * limit
      const coins = await CoinModel
      .find({ tags: 'top100' })
      .sort({ market_cap_rank: 1 })
      .skip(skip)
      .limit(limit);
      const total = await CoinModel.countDocuments({tags: 'top100'})
      
      return {
        data: coins.map(mapCoinData),
        //total,
        //page,
        //totalPages: Math.ceil(total / limit)
      }
    } catch (error) {
      throw error;
    }
  }

  async getCoinById(id) {
    try {
      let token = await CoinModel.findOne({ id });
      let timeFresh = 5 * 60 * 1000;
      if (!token.current_price) {
        timeFresh = 0
      }

      if (token && token.updatedAt) {
        const isFresh = (Date.now() - token.updatedAt.getTime()) < timeFresh;
        if (isFresh) {
          console.log('Data from DB');
          return mapCoinData(token);
        }
      }

      const response = await axios.get(`${constants.COINGECKO_BASEURL}/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        },
      });

      const coin = response.data;
      const formatted = {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image.large,
        current_price: coin.market_data.current_price.usd,
        market_cap: coin.market_data.market_cap.usd,
        market_cap_rank: coin.market_cap_rank,
        total_volume: coin.market_data.total_volume.usd,
        price_change_percentage_24h: coin.market_data.price_change_percentage_24h,
        high_24h: coin.market_data.high_24h.usd,
        low_24h: coin.market_data.low_24h.usd,
        circulating_supply: coin.market_data.circulating_supply,
        max_supply: coin.market_data.max_supply,
        last_updated: coin.market_data.last_updated || new Date(),
      };

      await CoinModel.findOneAndUpdate({ id: coin.id }, { $set: formatted }, { upsert: true });

      console.log('Data from API');
      return formatted;
    } catch (error) {
      throw error;
    }
  }

  async updateTrending() {
    try {
        await CoinModel.deleteMany({
            tags: { $size: 1, $all: ['trending'] }
          })
        const response = await axios.get(`${constants.COINGECKO_BASEURL}/search/trending`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 15,
                page: 1
            }
        })
        const rawCoins = response.data.coins
        const coins = rawCoins.map(c => c.item) // из-за отличий структуры получаемых данных в отличае от updatePopular

        const operations = coins.map((coin) => ({
            updateOne: {
                filter: { id: coin.id },
                update: {
                    $set: {
                      id: coin.id,
                      symbol: coin.symbol,
                      name: coin.name,
                      image: coin.image,
                      current_price: coin.current_price,
                      market_cap: coin.market_cap,
                      market_cap_rank: coin.market_cap_rank,
                      total_volume: coin.total_volume,
                      price_change_percentage_24h: coin.price_change_percentage_24h,
                      high_24h: coin.high_24h,
                      low_24h: coin.low_24h,
                      circulating_supply: coin.circulating_supply,
                      max_supply: coin.max_supply,
                      last_updated: coin.last_updated || new Date(),
                    }, 
                    $addToSet: { tags: 'trending' }
                },
                upsert: true
            }
        }))

        await CoinModel.bulkWrite(operations)
        console.log('Trending обновлены')
    } catch (error) {
        throw error
    }
}
  async getTrending() {
    try {
      const trending = await CoinModel.find({ tags: 'trending' }).sort({ market_cap_rank: 1 });
      return trending.map(mapCoinData);
    } catch (error) {
      throw error;
    }
  }

  async getCoinChart(id, days) {
    try {
      const token = await ChartModel.findOne({ coinId: id, interval: days });

      if (token && token.updatedAt) {
        const freshnessLimit = freshnessByInterval[days];
        const isFresh = (Date.now() - token.updatedAt.getTime()) < freshnessLimit;
        if (isFresh) {
          console.log('Chart from DB');
          console.log(daysToNum[days])
          return token;
        }
      }


      const response = await axios.get(`${constants.COINGECKO_BASEURL}/coins/${id}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: daysToNum[days],
        },
      });

      const chartData = {
        coinId: id,
        interval: days,
        prices: response.data.prices,
        market_caps: response.data.market_caps,
        total_volumes: response.data.total_volumes,
        updatedAt: new Date(),
      };

      await ChartModel.findOneAndUpdate(
        { coinId: id, interval: days },
        { $set: chartData },
        { upsert: true }
      );

      console.log('Chart from API');
      return chartData;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CoinDbService();
