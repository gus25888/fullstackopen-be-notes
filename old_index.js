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

// Middleware definido para ver datos de las solicitudes.
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

// Se invoca antes de los endpoints para que aplique a todos.
// app.use(requestLogger)

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

/* ***************ROUTES*************** */



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1;
}


app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>')
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    }
    else {
        response.status(404).end()
    }
})


app.get('/api/notes', (request, response) => {
    response.json(notes)
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

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId()
    }

    notes = notes.concat(note)

    response.json(note)
})






const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
