const mongoose = require('mongoose')

/*
 * Preparación de esquema para indicar los nombres de los campos del documento que se obtendrán desde la BD conectada.
 * Además, en el objeto enviado para su configuración se indica el tipo y las validaciones que tendrá el campo.
*/
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
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
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)