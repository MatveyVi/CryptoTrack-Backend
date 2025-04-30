const express = require('express')
const router = express.Router()
const { 
  UserController, 

} = require('../controllers')
const { authCheck } = require('../middleware/auth')

//Auth + current endpoints
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/users/:id', authCheck, UserController.getUserById)
router.get('/activate/:link', UserController.activate)
//router.post('/logout', UserController.)
//router.get('/activate/:link', UserController.)
//router.get('/current', UserController.)


module.exports = router 