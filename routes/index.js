const express = require('express')
const router = express.Router()
const { 
  UserController, 

} = require('../controllers')


router.get('/register', UserController.register)

module.exports = router 