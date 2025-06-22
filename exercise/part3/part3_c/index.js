const http = require('http');

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// import
const Note = require('./models/note');
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

let notes = [
  {
    id: '1',
    content: 'HTML is easy',
    important: true,
  },
  {
    id: '2',
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: '3',
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
  {
    id: '4',
    content: 'Leo Testing',
    important: true,
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!<h1/>');
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get('/api/notes/:id', (request, response, next) => {
  // mongoDB find
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
  // .catch((error) => {
  //   console.log(error);
  //   response.status(400).send({ error: 'malformatted Id' });
  // });
  // const id = request.params.id;
  // const note = notes.find((note) => note.id === id);

  // if (note) {
  //   response.json(note);
  // } else {
  //   response.status(404).end();
  // }
  // //   response.json(note);
});

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({ error: 'conent missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
  // const id = request.params.id;
  // notes = notes.filter((note) => note.id !== id);
  // response.status(204).end();
});

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body;
  Note.findById(request.params.id)
    .then((note) => {
      if (!note) {
        return response.status(404).end();
      }

      note.content = content;
      note.important = important;

      return note.save().then((updatedNote) => {
        response.json(updatedNote);
      });
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

app.use(errorHandler);
