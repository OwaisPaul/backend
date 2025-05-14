const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

const phoneRegexp = /^\d{2,3}-\d+$/ // 2 0r 3 digits, dash, then one or more digits 

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long']
  },
  number: {
    type: String,
    minlength: [8, 'Number must be at least 8 characters long'],

    required: [true, 'Number is required'],
    validate: {
      validator: function(v) {
        return phoneRegexp.test(v)
      },
      message: props => `${props.value} is not a valid phone number ! Use format XX-XXXXXX or XXX-XXXXXX`
    }
  }
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
  }
})

module.exports = mongoose.model('Person', personSchema)