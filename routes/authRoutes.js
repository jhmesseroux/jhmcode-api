const express = require('express')
const authController = require('../controllers/authController')

const authRoute = express.Router()

authRoute.post('/signup', authController.signUp)
authRoute.post('/signin', authController.signIn)
authRoute.post('/forgotPassword', authController.forgotPassword)
authRoute.patch('/resetPassword/:token', authController.resetPassword)

authRoute.use(authController.protect)
authRoute.post('/renewToken', authController.renewToken)

module.exports = authRoute
