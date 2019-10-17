const express = require('express')
const mongoose = require('mongoose')
const databaseConfig = require('./config/database')
const cors = require('cors')

const logMiddleware = function(req, res, next) {
  console.log(
    `HOST: ${req.headers.host} | URL: ${req.url} | METHOD: ${req.method}`
  )
  return next()
}

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.cors()
    this.database()
    this.middleware()
    this.routes()
  }

  database () {
    mongoose.connect(databaseConfig.uri, {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middleware () {
    this.express.use(express.json())
    this.express.use(logMiddleware)
  }

  routes () {
    this.express.use(require('./routes'))
  }

  cors () {
    this.express.use(cors())
  }
}

module.exports = new App().express
