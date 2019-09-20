const Pool = require('pg').Pool
const queries = require('./queries')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
require('dotenv/config')

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
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
  jwt.verify(request.token, process.env.SECRET_KEY, (_err, authData) => {
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
  jwt.verify(request.token, process.env.SECRET_KEY, (_err, authData) => {
    if (_err) {
      response.sendStatus(403)
    } else {
      try {
        if (tableName === 'administrator') {
          poolQuery(
            queries.SELECT_ONE(tableName, request.params.cpf),
            response,
            tableName
          )
        } else {
          poolQuery(
            queries.SELECT_ONE(tableName, request.params.id),
            response,
            tableName
          )
        }
      } catch (error) {
        response.status(400).json({ error: error.message })
      }
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
  try {
    poolQuery(
      queries.INSERT(tableName, request.body),
      response,
      tableName,
      ' successfully added'
    )
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
  // jwt.verify(request.token, process.env.SECRET_KEY, (_err, authData) => {
  //   if (_err) {
  //     response.sendStatus(403)
  //   } else {
  //   }
  // })
}

const update = (request, response) => {
  const requestUrl = request.path.split('/')
  const tableName = requestUrl[requestUrl.length - 2]
  jwt.verify(request.token, process.env.SECRET_KEY, (_err, authData) => {
    if (_err) {
      response.sendStatus(403)
    } else {
      try {
        if (tableName === 'administrator') {
          console.log('AHAHAHAHAHAH')
          console.log(
            queries.UPDATE(tableName, request.body, 'cpf', request.params.cpf)
          )
          poolQuery(
            queries.UPDATE(tableName, request.body, 'cpf', request.params.cpf),
            response,
            tableName,
            ' successfully updated'
          )
        } else {
          poolQuery(
            queries.UPDATE(
              tableName,
              request.body,
              'idClient',
              request.params.id
            ),
            response,
            tableName,
            ' successfully updated'
          )
        }
      } catch (error) {
        response.status(400).json({ error: error.message })
      }
    }
  })
}

const remove = (request, response) => {
  const requestUrl = request.path.split('/')
  const tableName = requestUrl[requestUrl.length - 2]
  jwt.verify(request.token, process.env.SECRET_KEY, (_err, authData) => {
    if (_err) {
      response.sendStatus(403)
    } else {
      if (tableName === 'administrator') {
        console.log('DELETANDO')
        console.log(queries.REMOVE(tableName, request.params.cpf, 'cpf'))
        poolQuery(
          queries.REMOVE(tableName, request.params.cpf, 'cpf'),
          response,
          tableName,
          ' successfully removed'
        )
      } else {
        poolQuery(
          queries.REMOVE(tableName, request.params.id, 'idClient'),
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
    console.log('req.token = ', req.token)
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
  remove
}
