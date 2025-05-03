const express = require('express')
const router = express.Router()
const { 
    UserController, 
    CoinGecko
  } = require('../controllers')
const { authCheck } = require('../middleware/auth')

//Coin API
router.get('/market', CoinGecko.getTopCoins) //Получение топ-30 монет для главной страницы
router.get('/trending', CoinGecko.getTrending) //Топ-15 популярных монет 
router.get('/:id', CoinGecko.getCoinById) //Получение расширенных данных по конкретной монете
router.get('/:id/chart', CoinGecko.getCoinChart) //Получение данных для графика по конкретной монете

module.exports = router