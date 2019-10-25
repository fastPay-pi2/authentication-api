const express = require('express')
const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')
const controllers = require('./app/controllers')

/**
 * CREATE USER ENDPOINT
 *
 * {
 *  "name": "name",
 *  "username": "username",
 *  "email": "user@gmail.com",
 *  "cpf": "18607999060",
 *  "password": "pass",
 *  "birphday": "2009-10-13T19:27:44.193Z",
 *  "isAdmin": false
 * }
 */
routes.post('/users', controllers.UserController.store)

/**
 * CREATE SESSION ENDPOINT
 *
 * {
 *  "email": "user@gmail.com",
 *  "password": "pass",
 * }
 */
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
