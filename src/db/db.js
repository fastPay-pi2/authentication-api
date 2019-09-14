const Pool = require('pg').Pool
const queries = require('./queries')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const pool = new Pool({
  user: 'user',
  host: 'database_authentication',
  database: 'db',
  password: 'pass',
  port: 5432
})

function poolQuery(query, response, tableName, msg) {
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    if (!msg) {
      response.status(200).json(results.rows)
    } else {
      response.status(200).json({ message: tableName.toUpperCase() + msg })
    }
  })
}

const getAll = (request, response) => {
  const tableName = request.path.replace(/\//g, '')
  jwt.verify(request.token, 'secretKey', (_err, authData) => {
    if (_err) {
      response.sendStatus(403)
    } else {
      poolQuery(queries.SELECT_ALL(tableName), response)
    }
  })
}

const getById = (request, response) => {
  const requestUrl = request.path.split('/')
  const tableName = requestUrl[requestUrl.length - 2]
  jwt.verify(request.token, 'secretKey', (_err, authData) => {
    if (_err) {
      response.sendStatus(403)
    } else {
      poolQuery(
        queries.SELECT_ONE(tableName, request.params.id),
        response,
        tableName
      )
    }
  })
}

const insert = (request, response) => {
  const tableName = request.path.split('/').join('')
  const validation = validationResult(request)
  const errors = validation.errors
  if (errors.length > 0) {
    return response.status(422).json({ errors: errors })
  }
  jwt.verify(request.token, 'secretKey', (_err, authData) => {
    if (_err) {
      response.sendStatus(403)
    } else {
      poolQuery(
        queries.INSERT(tableName, request.body),
        response,
        tableName,
        ' successfully added'
      )
    }
  })
}

const update = (request, response) => {
  const requestUrl = request.path.split('/')
  const tableName = requestUrl[requestUrl.length - 2]
  jwt.verify(request.token, 'secretKey', (_err, authData) => {
    if (_err) {
      response.sendStatus(403)
    } else {
      if (tableName === 'product') {
        poolQuery(
          queries.UPDATE(tableName, request.body, 'id', request.params.id),
          response,
          tableName,
          ' successfully updated'
        )
      } else {
        poolQuery(
          queries.UPDATE(tableName, request.body, 'rfid', request.params.id),
          response,
          tableName,
          ' successfully updated'
        )
      }
    }
  })
}

const remove = (request, response) => {
  const requestUrl = request.path.split('/')
  const tableName = requestUrl[requestUrl.length - 2]
  jwt.verify(request.token, 'secretKey', (_err, authData) => {
    if (_err) {
      response.sendStatus(403)
    } else {
      if (tableName === 'product') {
        poolQuery(
          queries.REMOVE(tableName, 'id', request.params.id),
          response,
          tableName,
          ' successfully removed'
        )
      } else {
        // tableName = 'item'
        poolQuery(
          queries.REMOVE(tableName, 'rfid', request.params.id),
          response,
          tableName,
          ' successfully removed'
        )
      }
    }
  })
}

// Token format
// Authorization: Bearer <acess token>

function verifyToken(req, res, next) {
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

module.exports = {
  getAll,
  getById,
  insert,
  update,
  remove,
  verifyToken
}
