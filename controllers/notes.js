const notesRouter = require('express').Router()
const Note = require('../models/note')


/* ***************ROUTES*************** */
notesRouter.get('/', (request, response, next) => {
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

notesRouter.get('/:id', (request, response, next) => {
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

notesRouter.post('/', (request, response, next) => {
  const body = request.body
  const newNote = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
  })

  newNote
    .save()
    .then(savedNote => response.json(savedNote))
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note
    .findByIdAndDelete(request.params.id)
    .then(() => { response.status(204).end() })
    .catch(error => next(error))
})



notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body
  const noteToUpdate = { content, important, }
  Note
    .findByIdAndUpdate(
      request.params.id,
      noteToUpdate,
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedNote => { response.json(updatedNote) })
    .catch(error => next(error))
})

module.exports = notesRouter