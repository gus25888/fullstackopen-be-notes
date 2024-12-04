require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const cors = require('cors')

const Note = require('./models/note')


const app = express()

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

app.get('/api/notes/:id', (request, response) => {
    Note
        .findById(request.params.id)
        .then(noteObtained => response.json(noteObtained))
})

app.get('/api/notes', (request, response) => {
    Note
        .find({})
        .then(notes => {
            response.json(notes)
        })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const newNote = new Note({
        content: body.content,
        important: Boolean(body.important) || false,
    })

    newNote
        .save()
        .then(savedNote => response.json(savedNote))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
