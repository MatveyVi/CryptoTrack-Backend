const express = require('express')
const router = express.Router()
const { 
  UserController, 

} = require('../controllers')
const { authCheck } = require('../middleware/auth')

//Auth + current endpoints
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/update/:id', authCheck, UserController.updateUser)
router.get('/users/:id', authCheck, UserController.getUserById)
router.get('/activate/:link', UserController.activate)
router.get('/current', authCheck, UserController.current)
//router.post('/logout', UserController.)

// CoinGecko API
router.get('/getData', UserController.getData)
module.exports = router 