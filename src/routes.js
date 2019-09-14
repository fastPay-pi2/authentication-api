const express = require('express')
const { checkSchema } = require('express-validator')
const routes = express.Router()
const jwt = require('jsonwebtoken')

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

routes.get('/product', db.verifyToken, db.getAll)
routes.get('/product/:id', db.verifyToken, db.getById)

routes.post(
  '/product/',
  db.verifyToken,
  checkSchema(schemas.productSchema),
  db.insert
)
routes.put(
  '/product/:id',
  db.verifyToken,
  checkSchema(schemas.productSchemaPut),
  db.update
)
routes.delete('/product/:id', db.verifyToken, db.remove)

routes.post('/api/login', (req, res) => {
  const user = {
    username: 'teste',
    password: 'teste'
  }
  jwt.sign({ user }, 'secretKey', { expiresIn: '365 days' }, (_err, token) => {
    res.json({
      token
    })
  })
})
/*
ITEM ENDPOINTS

JSON format:
{
  "rfid": "1",
  "expirationDate": "2019-12-26",
  "idProduct": 1
}
*/

routes.get('/item', db.verifyToken, db.getAll)
routes.get('/item/:id', db.verifyToken, db.getById)
routes.post(
  '/item/',
  db.verifyToken,
  checkSchema(schemas.itemSchema),
  db.insert
)
routes.put(
  '/item/:id',
  db.verifyToken,
  checkSchema(schemas.itemSchemaPut),
  db.update
)
routes.delete('/item/:id', db.verifyToken, db.remove)

module.exports = routes
