require('dotenv').config()

// const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/phonebook')
const app = express()

// console.log(Person.find({}), 'line11');

// create token
morgan.token('post-body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

// middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-body',
  ),
)

app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
  // res.json(persons);
})

app.get('/info', (req, res) => {
  const time = new Date()
  Person.find({}).then((persons) => {
    const total = persons.length
    console.log(`person length ${total}`)

    res.send(`
      <div>
          <p>Phonebook has info for ${total} people</p>
          <p>${time}</p>
      </div>`)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id

  Person.findById(id).then((person) => {
    res.json(person)
  })

  // const person = persons.find((p) => p.id === id);
  // if (person) {
  //   res.json(person);
  // } else {
  //   res.status(404).end();
  // }
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
  // const id = req.params.id;
  // persons = persons.filter((p) => p.id !== id);
  // res.status(204).end();
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'required name and number' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savePerson) => {
      res.json(savePerson)
    })
    .catch((error) => next(error))

  // const exist = persons.find((p) => p.name === body.name);

  // if (!body.name || !body.number || exist) {
  //   return res.status(400).json({ error: 'name must be unique' });
  // }

  // const person = {
  //   name: body.name,
  //   number: body.number,
  //   id: String(genID()),
  // };

  // persons = persons.concat(person);
  // res.json(person);
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  Person.findById(req.params.id).then((p) => {
    if (!p) {
      return res.status(404).end()
    }

    p.name = name
    p.number = number
    return p
      .save()
      .then((updated) => {
        res.json(updated)
      })
      .catch((error) => next(error))
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server at ${PORT}`)
})

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)
