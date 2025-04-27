const express = require('express')
const router = express.Router()
const { 
  UserController, 

} = require('../controllers')


router.get('/current', UserController.register)

module.exports = router 