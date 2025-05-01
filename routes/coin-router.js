const express = require('express')
const router = express.Router()
const { 
    UserController, 
    CoinGecko
  } = require('../controllers')
const { authCheck } = require('../middleware/auth')

//Coin API
router.get('/market', CoinGecko.getTopCoins) //Получение топ-30 монет для главной страницы

module.exports = router