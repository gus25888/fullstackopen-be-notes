const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
require('express-async-errors')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')

const app = express()


/* ************** Conexión BD **************  */
mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => { logger.info('Connected to MongoDB') })
  .catch((error) => { logger.error('Error connecting to MongoDB:', error.message) })



/* ************** Middlewares **************  */
app.use(cors())
// Middleware para permitir que se obtengan archivos estaticos ubicados en el directorio enviado.
app.use(express.static('dist'))
// Middleware de express (json-parser) usado transformar datos JS a JSON directamente.
app.use(express.json())
app.use(middleware.requestLogger)


/* ************** Middlewares de Rutas **************  */
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

/* ************** Middlewares para ruta no conocida y de errores **************  */
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app