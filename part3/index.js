const http = require('http');
const express = require('express');
const morgan = require('morgan');

const app = express();

// create token
morgan.token('post-body', (req, res) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

// middlewares
app.use(express.json());
app.use(morgan('tiny'));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-body'
  )
);

persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const total = persons.length;
  const time = new Date();
  res.send(`
    <div>
        <p>Phonebook has info for ${total} people</p>
        <p>${time}</p>
    </div>`);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

const genID = () => {
  return Math.random() * 1000;
};

app.post('/api/persons', (req, res) => {
  const body = req.body;
  const exist = persons.find((p) => p.name === body.name);

  if (!body.name || !body.number || exist) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: genID(),
  };

  persons = persons.concat(person);
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server at ${PORT}`);
});
