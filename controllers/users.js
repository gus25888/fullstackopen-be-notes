const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', { content: 1, important: 1 })
  response.json(users)
})


usersRouter.post('/', async (request, response) => {
  const minLengthPassword = 8, minLengthUsername = 4
  const { username, name, password } = request.body

  const passwordPattern = new RegExp(`\\b\\w{${minLengthPassword},}\\b`)
  const usernamePattern = new RegExp(`\\b[a-z]{${minLengthUsername},}\\b`)

  if (!username) {
    return response.status(400).json({ error: 'username is required' })
  } else if (username.length < minLengthUsername) {
    return response.status(400).json({ error: 'username minimum length is ' + minLengthUsername })
  } else if (!usernamePattern.test(username)) {
    return response.status(400).json({ error: `username must contain at least ${minLengthUsername} lowercase characters.` })
  }

  if (!name) {
    return response.status(400).json({ error: 'name is required' })
  }

  if (!password) {
    return response.status(400).json({ error: 'password is required' })
  } else if (password.length < minLengthPassword) {
    return response.status(400).json({ error: 'password minimum length is ' + minLengthPassword })
  } else if (!passwordPattern.test(password)) {
    return response.status(400).json({ error: `password must contain at least ${minLengthUsername} lowercase, uppercase and number characters.` })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter