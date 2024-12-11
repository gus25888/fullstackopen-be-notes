const { after, beforeEach, describe, test } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

/*
* `helper` tiene varias funciones que se repiten en la generación de las pruebas,
* por lo que, en busca de DRY, se separan a un módulo externo.
*/
const Note = require('../models/note')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)


/*
* Las siguientes lineas generan las notas que requiren
* las pruebas, sin embargo, es poco optimo, ya que en caso
* de requerir más notas, habría que modificar este código.

  beforeEach(async () => {
    await Note.deleteMany({})

    let noteObject = new Note(helper.initialNotes[0])
    await noteObject.save()
    noteObject = new Note(helper.initialNotes[1])
    await noteObject.save()
  })

* Se llega a la siguiente solución, la cual considera el uso de Promise.all()
* para poder permitir que el proceso sea asíncrono, y que, a la vez,
* se complete ANTES que inicien las pruebas.
*/

describe('when there is initially some notes saved', () => {
  // Funcion que se ejecuta antes de cada prueba realizada.
  beforeEach(async () => {
    await Note.deleteMany({})

    // Se generan un array con las notas a crear
    const noteObjects = helper.initialNotes.map(note => new Note(note))
    // Se genera un array con promesas de la creación de cada nota.
    const promiseArray = noteObjects.map(note => note.save())
    // Se espera a que todas se cumplan para continuar.
    await Promise.all(promiseArray)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      // Espera un código de exito
      .expect(200)
      // En este punto se espera recibir un texto que contenga un 'application/json'.
      // Se valida con un regex,debido a que la response contendrá, probablemente, otros caracteres extra.
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    // Se valida el largo de response obtenida.
    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultNote.body, noteToView)
  })


  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()

      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultNote.body, noteToView)
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/notes/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/notes/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(n => n.content)
      assert(contents.includes('async/await simplifies making async calls'))
    })

    test('fails with status code 400 if data invalid', async () => {
      const newNote = {
        important: true
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

      const notesAtEnd = await helper.notesInDb()

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })


  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDb()

      const contents = notesAtEnd.map(r => r.content)
      assert(!contents.includes(noteToDelete.content))

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })
  })
})



after(async () => {
  await mongoose.connection.close()
})