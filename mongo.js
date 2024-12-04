const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

console.log(process.argv[0], process.argv[1], process.argv[2]);


const dbUser = 'gustavobaezaavello';
const password = process.argv[2];
const cluster = 'micluster.5gar3aw.mongodb.net';
const dbName = 'notesApp';

const url =
    `mongodb+srv://${dbUser}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)


mongoose
    .connect(url)
    .then(result => console.log(`Connected to MongoDB`))
    .catch(error => console.log(`Error connecting to MongoDB`, error.message))

//* Para poder manejar los datos se debe generar primero un esquema que indique a mongoose, como es la estructura de los datos a usar
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

//* Luego, ese esquema se usa para generar el modelo, que es la forma de poder generar la interacción con mongoDB.
const Note = mongoose.model('Note', noteSchema)

//* Esto genera una "clase" que permite generar un nuevo objeto el cual se puede enviar para guardado en la BD.
const note = new Note({
    content: 'Learning Mongoose',
    important: true,
})

//* Se usa la variable generada para luego guardar la info. de forma asincrona.
note.save().then(result => {
    console.log(result);

    console.log('note saved!')
    mongoose.connection.close()
})

//* Para poder consultar datos se usa el "modelo" instanciado, el cual con su método find, obtiene la información requerida, aplicando los filtros como sus parámetros en forma de objeto.
// Note
// .find({ important: false })
// .then(result => {
//      result.forEach(note => {
//      console.log(note);
//     })
//     mongoose.connection.close()
// })