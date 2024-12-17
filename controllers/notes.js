const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()

const Note = require('../models/note')
const User = require('../models/user')



const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}


/* ***************ROUTES*************** */
notesRouter.get('/', async (request, response) => {
  const result = await Note.find({}).populate('user', { username: 1, name: 1 })
  if (result) {
    response.json(result)
  } else {
    response.status(404).end()
  }
})

notesRouter.get('/:id', async (request, response) => {
  const result = await Note.findById(request.params.id)
  if (result) {
    response.json(result)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  console.log(decodedToken)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const newNote = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
    user: user.id
  })

  const savedNote = await newNote.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)

})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
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