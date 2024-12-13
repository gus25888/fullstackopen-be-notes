const bcrypt = require('bcrypt')
const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
    user: '675b783678d4e7d952fca1a0'
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
    user: '675b783678d4e7d952fca1a0'
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const userInitialization = async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ id: '675b783678d4e7d952fca1a0', username: 'root', passwordHash })

  await user.save()
}

module.exports = {
  initialNotes, nonExistingId, notesInDb, usersInDb, userInitialization
}