const express = require('express');
const morgan = require('morgan');

const app = express()

//some middlewares
//to access the data easily, we need Express json-parser
//parses JSON bodies first
app.use(express.json())


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

// use a custom format including the body
app.use(morgan(':method :url :status - :response-time ms - :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
// the below method is the first method to get the time and date
//toLocaleTimeString() is a JavaScript method that converts a Date object into a string
//showing the time, formatted based on the user's local settings (locale) — like their region, language,
//and time preferences.
// this is the second method to convert the date object into a string 
// convert a Date object to a string with .toString()

// request for info
app.get('/info', (request, response) => {
  const now = new Date();
  response.send(`<h2>Phonebook has info for ${persons.length} people</h2><h3>${now.toString()}</h3>`);
});

  // request for all persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
// handling request for single resource
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).send({ error: 'Person not found' });
    }
});

// for deleting a single entry by making an HTTP Delete request to the unique URL
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


// function for generating id's
   const generatedId = () => {
    // finding out the largest id number in the current list and assign it to the maxId variable.
    // we can use Math.random too but i think this is more decent way to generate id's
  const maxId = persons.length > 0
  ? Math.max(...persons.map(person => Number(person.id)))
  : 0
  return String(maxId + 1)
   }
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
    const nameExists = persons.find(person => person.name === body.name);
    
    if(nameExists){
      return response.status(400).json({
        error: 'name must be unique'
      });
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generatedId(),      
    }

    persons = persons.concat(person)

    response.json(persons)

})
// to make our app listen to the port 3000
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});