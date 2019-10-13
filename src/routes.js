const express = require('express')
const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')
const controllers = require('./app/controllers')

routes.post('/users', controllers.UserController.store)
routes.post('/sessions', controllers.SessionController.store)

routes.use(authMiddleware)

routes.get('/check', (req, res) => res.json({ isValid: true }))

/**
 * User manage
 */

routes.get('/users', controllers.UserController.index)
routes.get('/users/:id', controllers.UserController.show)
routes.put('/users/:id', controllers.UserController.update)
routes.delete('/users/:id', controllers.UserController.destroy)

module.exports = routes
