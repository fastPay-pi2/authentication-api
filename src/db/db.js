const Pool = require('pg').Pool
const queries = require('./queries')
const { validationResult } = require('express-validator')
const pool = new Pool({
  user: 'user',
  host: 'database',
  database: 'db',
  password: 'pass',
  port: 5432
})

const getAll = (request, response) => {
  const tableName = request.path.replace('/', '')
  pool.query(queries.SELECT_ALL(tableName), (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getById = (request, response) => {
  const requestUrl = request.path.split('/')
  const tableName = requestUrl[requestUrl.length - 2]
  pool.query(
    queries.SELECT_ONE(tableName, request.params.id),
    (error, results) => {
      if (error) {
        response
          .status(404)
          .json({ message: tableName.toUpperCase() + ' not found' })
        // throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

const insert = (request, response) => {
  const tableName = request.path.split('/').join('')

  const validation = validationResult(request)
  const errors = validation.errors
  if (errors.length > 0) {
    return response.status(422).json({ errors: errors })
  }

  // queries.INSERT(tableName, request.body)
  // return response.json({message: 'ok'})
  pool.query(queries.INSERT(tableName, request.body), (error, results) => {
    if (error) {
      throw error
    }
    // results.rows
    response
      .status(200)
      .json({ message: tableName.toUpperCase() + ' successfully added' })
  })
}

const update = (request, response) => {
  const requestUrl = request.path.split('/')
  const tableName = requestUrl[requestUrl.length - 2]
  // queries.INSERT(tableName, request.body)
  // return response.json({message: 'ok'})
  pool.query(
    queries.UPDATE(tableName, request.body, 'id', request.params.id),
    (error, results) => {
      if (error) {
        throw error
      }
      // results.rows
      response
        .status(200)
        .json({ message: tableName.toUpperCase() + ' successfully updated' })
    }
  )
}

const remove = (request, response) => {
  const requestUrl = request.path.split('/')
  const tableName = requestUrl[requestUrl.length - 2]
  pool.query(
    queries.REMOVE(tableName, 'id', request.params.id),
    (error, results) => {
      if (error) {
        response
          .status(404)
          .json({ message: tableName.toUpperCase() + ' not found' })
        // throw error
      }
      response
        .status(200)
        .json({ message: tableName.toUpperCase() + ' successfully removed' })
    }
  )
}

const updateItem = (request, response) => {
  const requestUrl = request.path.split('/')
  const tableName = requestUrl[requestUrl.length - 2]
  // queries.INSERT(tableName, request.body)
  // return response.json({message: 'ok'})
  pool.query(
    queries.UPDATE(tableName, request.body, 'rfid', request.params.id),
    (error, results) => {
      if (error) {
        throw error
      }
      // results.rows
      response
        .status(200)
        .json({ message: tableName.toUpperCase() + ' successfully updated' })
    }
  )
}

const removeItem = (request, response) => {
  const requestUrl = request.path.split('/')
  const tableName = requestUrl[requestUrl.length - 2]
  pool.query(
    queries.REMOVE(tableName, 'rfid', request.params.id),
    (error, results) => {
      if (error) {
        response
          .status(404)
          .json({ message: tableName.toUpperCase() + ' not found' })
        // throw error
      }
      response
        .status(200)
        .json({ message: tableName.toUpperCase() + ' successfully removed' })
    }
  )
}

module.exports = {
  getAll,
  getById,
  insert,
  update,
  remove,
  updateItem,
  removeItem
}
