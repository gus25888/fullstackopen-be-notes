const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI;

/* Conexión a mongoDB */
mongoose
    .connect(url)
    .then(result => console.log(`Connected to MongoDB`))
    .catch(error => console.log(`Error connecting to MongoDB`, error.message))

/** Preparación de esquema para indicar los nombres y tipos de los documentos que se obtendrán desde la BD conectada. */
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

/*
* Este proceso (set ('toJSON') ) permite personalizar el esquema y la forma en que devuelve los documentos desde Mongo.
* Mongoose requiere que cada documento, tenga su propio "id" por lo que se genera esa variable en cada uno
* basado en la propiedad de _id ya existente, pasando de ObjectId a string.
* Finalmente, se eliminan las propiedades no utilizadas.
*/
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Note', noteSchema);