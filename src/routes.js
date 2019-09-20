const express = require('express')
const { checkSchema } = require('express-validator')
const routes = express.Router()
require('dotenv/config')

const db = require('./db/db')
const schemas = require('./db/schemas')
const authentication = require('./db/authentication')

routes.get('/', (req, res) => {
  return res.json({
    message: 'A gnt vai usar pg msm'
  })
})

/*
PRODUCT ENDPOINTS

JSON format:
{
  "name": "product 4",
  "image": "image 4",
  "price": 8000.234
}
*/

routes.get(
  '/client/:id',
  authentication.setRequestToken,
  authentication.userIsRegistered,
  db.getById
)
routes.post(
  '/client/',
  // checkSchema(schemas.productSchema),
  db.insert
)
routes.put(
  '/client/:id',
  authentication.setRequestToken,
  authentication.userIsRegistered,
  // checkSchema(schemas.productSchemaPut),
  db.update
)
routes.delete(
  '/client/:id',
  authentication.setRequestToken,
  authentication.userIsRegistered,
  db.remove
)

/*
ADMIN ENDPOINTS

JSON format:
{
  "cpf": "111111111",
  "password": "pass",
  "name": "name 1",
  "phoneNumber": "123",
  "birthday": "2018-11-13",
  "email": "email@email.com",
  "image": "asaas"
}

*/

routes.get(
  '/administrator/:cpf',
  authentication.setRequestToken,
  authentication.userIsRegistered,
  db.getById
)
routes.post(
  '/administrator/',
  checkSchema(schemas.administratorSchema),
  authentication.setRequestToken,
  authentication.userIsRegistered,
  db.insert
)
routes.put(
  '/administrator/:cpf',
  authentication.setRequestToken,
  authentication.userIsRegistered,
  // checkSchema(schemas.administratorSchemaPut),
  db.update
)
routes.delete(
  '/administrator/:cpf',
  authentication.setRequestToken,
  authentication.userIsRegistered,
  db.remove
)

// AUTHENTICATION ENDPOINTS

// routes.get(
//   '/validate/administrator',
//   authentication.setRequestToken,
//   (request, response, next) => {
//     authentication.verifyToken(request, response, next)
//   }
// )

routes.post(
  '/administrator/login/',
  db.authenticateUser,
  authentication.userIsRegistered
)

routes.post('/client/login/', db.authenticateUser, authentication.validateUser)

// routes.get(
//   '/validate/client',
//   authentication.setRequestToken,
//   authentication.userIsRegistered
// )

module.exports = routes
