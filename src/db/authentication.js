const jwt = require('jsonwebtoken')
const Pool = require('pg').Pool
const queries = require('./queries')
require('dotenv/config')

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
})

// Token format
// Authorization: Bearer <acess token>

function setRequestToken(req, res, next) {
  const bearerHeader = req.headers.authorization
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(403)
  }
}

function generateToken(results, response, tableName) {
  if (tableName === 'administrator') {
    jwt.sign(
      { name: results.name, password: results.password },
      process.env.SECRET_KEY,
      { expiresIn: '365 days' },
      (_err, token) => {
        response.json({
          token
        })
      }
    )
  } else if (tableName === 'client') {
    console.log('username = ', results.username)
    console.log('id = ', results.idclient)
    jwt.sign(
      {
        id: results.idclient,
        username: results.username,
        password: results.password
      },
      process.env.SECRET_KEY,
      { expiresIn: '365 days' },
      (_err, token) => {
        response.json({
          token
        })
      }
    )
  }
}

const validateUser = (tableName, decodedToken, response, next) => {
  pool.query(
    queries.isRegistered(tableName, decodedToken),
    (error, results) => {
      if (error) {
        response.status(400).json({ message: error.message })
      }

      if (results.rows.length > 0) {
        next()
      } else {
        return response.status(400).json({ message: tableName + ' not found' })
      }
    }
  )
}

const authenticateUser = (request, response) => {
  const requestUrl = request.path.split('/')
  requestUrl.shift()
  const tableName = requestUrl[0]
  pool.query(
    queries.isRegistered(tableName, request.body),
    (error, results) => {
      if (error) {
        response.status(400).json({ message: error.message })
      }
      if (results.rows.length === 0) {
        response
          .status(400)
          .json({ message: tableName.toUpperCase() + ' not found' })
      } else {
        generateToken(results.rows[0], response, tableName)
      }
    }
  )
}

const validateUserToken = (tableName, decodedToken, response, next) => {
  pool.query(
    queries.isRegistered(tableName, decodedToken),
    (error, results) => {
      if (error) {
        response.status(400).json({ message: error.message })
      }

      if (results.rows.length > 0) {
        return response.status(200).json({ message: 'top' })
      } else {
        return response.status(400).json({ message: tableName + ' not found' })
      }
    }
  )
}

const userIsRegistered = (request, response, next) => {
  const requestUrl = request.path.split('/')
  requestUrl.shift()
  const tableName = requestUrl[0]
  const decodedToken = jwt.decode(request.token, process.env.SECRET_KEY)
  try {
    validateUser(tableName, decodedToken, response, next)
  } catch (TypeError) {
    response.json({ error: 'wrong token' })
  }
}

const verifyToken = (request, response) => {
  jwt.verify(request.token, process.env.SECRET_KEY, (_err, token) => {
    if (_err) {
      return response.json({ message: _err })
    } else {
      try {
        authenticateUser(request, response)
        if (token) {
          return response.json({ message: 'Access authorized' })
        } else {
          return response.json({ message: 'Access denied' })
        }
      } catch (TypeError) {
        return response.json({ message: 'Access denied' })
      }
    }
  })
}

module.exports = {
  setRequestToken,
  authenticateUser,
  validateUser,
  verifyToken,
  userIsRegistered
}
