require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const cors = require('cors')

const Note = require('./models/note')


const app = express()

/** Middelwares usados por todos los endpoints */
// Middleware de express (json-parser) usado transformar datos JS a JSON directamente.
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
// Middleware para permitir que se obtengan archivos estaticos ubicados en el directorio enviado.
app.use(express.static('dist'))



/* ***************ROUTES*************** */
app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>')
})

app.get('/api/notes/:id', (request, response, next) => {
    Note
        .findById(request.params.id)
        .then(noteObtained => {
            if (noteObtained) {
                response.json(noteObtained)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/api/notes', (request, response, next) => {
    Note
        .find({})
        .then(notes => {
            if (notes) {
                response.json(notes)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note
        .findByIdAndDelete(request.params.id)
        .then(result => { console.log(result); response.status(204).end() })
        .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    // if (!body.content) {
    //     return response.status(400).json({
    //         error: 'content missing'
    //     })
    // }

    const newNote = new Note({
        content: body.content,
        important: Boolean(body.important) || false,
    })

    newNote
        .save()
        .then(savedNote => response.json(savedNote))
        .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const { content, important } = request.body;

    /* Consideraciones para findByIdAndUpdate
    * Se genera un objeto plano con el nuevo contenido de la nota.
    * NO SE USA una nueva instancia de Note para esto.
    * Requiere:
    *   id Documento,
    *   nuevos valores a modificar
    *   opciones:
    *       new: true,           indica que el resultado de la operacion retornará la nota actualizada.
    *       runValidators: true, indica que se utilizará las validaciones definidas en el Schema
    *       context: 'query',    permite indicar que el contexto de la validacion afecta solo a esta operación.
    */
    Note
        .findByIdAndUpdate(
            request.params.id,
            { content, important, },
            { new: true, runValidators: true, context: 'query' })
        .then(updatedNote => { response.json(updatedNote) })
        .catch(error => next(error))
})


/* Middleware para el manejo de endpoints no definidos */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


/* Middleware controlador de errores */

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    /* En caso de no encontrar algún error específico se envia el error al manejador de errores de Express */
    next(error)
}

app.use(errorHandler)


/* ********************* APP INIT ********************* */

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
