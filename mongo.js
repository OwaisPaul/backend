const mongoose = require('mongoose')

// Ensure at least password is given
if (process.argv.length < 3) {
  console.log('Usage:')
  console.log('  To add: node filename.js password name number')
  console.log('  To list: node filename.js password phonebook')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://owaispaul:${password}@cluster0.rlo42lw.mongodb.net/phone-book?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3] === 'phonebook') {
  // Show all contacts
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  // Add a new contact
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({ name, number })

  person.save().then(() => {
    console.log(`Added ${name} ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Invalid arguments.')
  console.log('Usage:')
  console.log('  To add: node filename.js <password> <name> <number>')
  console.log('  To list: node filename.js <password> phonebook')
  mongoose.connection.close()
}
