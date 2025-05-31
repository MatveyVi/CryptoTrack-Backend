const express = require('express')
const router = express.Router()
const { 
  UserController, 
  CoinGecko
} = require('../controllers')
const { authCheck } = require('../middleware/auth')

//Auth + current endpoints
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.put('/users/:id', authCheck, UserController.updateUser)
router.get('/users/:id', authCheck, UserController.getUserById)
router.get('/activate/:link', UserController.activate)
router.get('/current', authCheck, UserController.current)
router.patch('/watchlist/delete/:coin', authCheck, UserController.deleteFromWatchlist)
router.patch('/watchlist/add/:coin', authCheck, UserController.addToWatchlist)
//router.post('/logout', UserController.)


module.exports = router 