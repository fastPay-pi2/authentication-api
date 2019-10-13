const express = require('express')
const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')
const controllers = require('./app/controllers')

routes.post('/users', controllers.UserController.store)
routes.post('/sessions', controllers.SessionController.store)

routes.get('/check', authMiddleware, (req, res) => res.json({ isValid: true }))

module.exports = routes
