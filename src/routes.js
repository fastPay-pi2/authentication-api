const express = require('express')
const { checkSchema } = require('express-validator')
const routes = express.Router()
const jwt = require('jsonwebtoken')
require('dotenv/config')

const db = require('./db/db')
const schemas = require('./db/schemas')

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

routes.get('/client/:id', db.verifyToken, db.getById)
routes.post(
  '/client/',
  db.verifyToken,
  // checkSchema(schemas.productSchema),
  db.insert
)
routes.put(
  '/client/:id',
  db.verifyToken,
  // checkSchema(schemas.productSchemaPut),
  db.update
)
routes.delete('/client/:id', db.verifyToken, db.remove)

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

routes.get('/administrator/:cpf', db.verifyToken, db.getById)
routes.post(
  '/administrator/',
  checkSchema(schemas.administratorSchema),
  db.verifyToken,
  db.insert
)
routes.put(
  '/administrator/:cpf',
  db.verifyToken,
  // checkSchema(schemas.administratorSchemaPut),
  db.update
)
routes.delete('/administrator/:cpf', db.verifyToken, db.remove)

// AUTHENTICATION ENDPOINTS

routes.get('/validate/administrator', db.verifyToken, (request, response) => {
  jwt.verify(request.token, process.env.SECRET_KEY, (_err, authData) => {
    if (_err) {
      response.sendStatus(403)
    } else {
      response.json({ message: 'You have signed up successfully' })
    }
  })
})
routes.post('/administrator/login/', db.verifyUser)

routes.post('/client/login/', db.verifyUser)
routes.get('/validate/client', db.verifyToken, (request, response) => {
  jwt.verify(request.token, process.env.SECRET_KEY, (_err, authData) => {
    if (_err) {
      response.sendStatus(403)
    } else {
      response.json({ message: 'You have signed up successfully' })
    }
  })
})

module.exports = routes
