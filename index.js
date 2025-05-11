
// to make Express show static content 
// we need a built-in middleware from Express called static
app.use(express.static('dist'))

//to access the data easily, we need Express json-parser
//parses JSON bodies first
app.use(express.json())

// use a custom format including the body
app.use(morgan(':method :url :status - :response-time ms - :body'))
require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/people')
//CONNECTING BACKEND TO THE DATABASE
const mongoose = require('mongoose')
const password = process.argv[2]


// mongoose.set('strictQuery', false)
// mongoose.connect(url)

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })
// personSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject._v
//   }
// })

// const Person = mongoose.model('Person' ,personSchema)
// saving express in a variable
const app = express()


// importing cors to allow requests from other origins 
const cors = require('cors')
app.use(cors())



//to use morgan as a middleware
//creating a custom token to log the request body
// morgan.token('body', ...) tells Morgan:
//“Hey, whenever you see :body in the log format,
//  run this function to get the value.”

morgan.token('body', (request) => {
  return JSON.stringify(request.body);
});



// the below method is the first method to get the time and date
//toLocaleTimeString() is a JavaScript method that converts a Date object into a string
//showing the time, formatted based on the user's local settings (locale) — like their region, language,
//and time preferences.
// this is the second method to convert the date object into a string 
// convert a Date object to a string with .toString()

// request for info
// app.get('/info', (request, response) => {
//   const now = new Date();
//   response.send(`<h2>Phonebook has info for ${persons.length} people</h2><h3>${now.toString()}</h3>`);
// });

  // request for all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
// handling request for single resource
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
      })
      .catch(error => next(error))
      // .catch(error => {
      //   console.log(error)
      //   response.status(400).send({ error: 'malformatted id'})
      // })
  })
  //   if (person) {
  //       response.json(person);
  //   } else {
  //       response.status(404).send({ error: 'Person not found' });
  //   }
  // })


// for deleting a single entry by making an HTTP Delete request to the unique URL
app.delete('/api/persons/:id', (request, response, next) => {
   Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// function for generating id's
  //  const generatedId = () => {
  //   // finding out the largest id number in the current list and assign it to the maxId variable.
  //   // we can use Math.random too but i think this is more decent way to generate id's
  // const maxId = persons.length > 0
  // ? Math.max(...persons.map(person => Number(person.id)))
  // : 0
  // return String(maxId + 1)
  //  }
// for adding new contacts 
app.post('/api/persons' ,(request, response) => {
  // without the json parser the body property would be undefined
  //json parser takes the JSON data of a request, transforms it into
  //  a javascript object and 
// then attaches it to the body property of the request object before 
// the route handler is called.
  const body = request.body

    if(!body.name) {
      return response.status(400).json({
        error: 'name missing'
      })
    } if(!body.number){
      return response.status(400).json({
        error: 'number missing'
      })
    } 
    // if name already exists
    // const nameExists = persons.find(person => person.name === body.name);
    
    // if(nameExists){
    //   return response.status(400).json({
    //     error: 'name must be unique'
    //   });
    // }

    const person = new Person({
      name: body.name,
      number: body.number,      
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    })
    // functionality to update the contact
    app.put('/api/persons/:id', (request, response, next) => {
      const {name, number} = request.body

      Person.findById(request.params.id)
      .then(person => {
        if (!person) {
          return response.status(404).end()
        }

        person.name = name
        person.number = number

        return person.save().then((updatedPerson) => {
          response.json(updatedPerson)
        })
      })
      .catch(error => next(error))
    })



    // express error handlers are middleware that are defined with a function that accepts 4 params
    const errorHandler = (error, request, response, next) => {
      console.error(error.message)
    
      if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } 
    
      next(error)
    }
    
    // this has to be the last loaded middleware, also all the routes should be registered before this!
    app.use(errorHandler)

// to make our app listen to the port
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})