const jwt = require('jsonwebtoken');

const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user');
  res.json(notes);
});

notesRouter.get('/:id', async (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

notesRouter.post('/', async (req, res, next) => {
  const body = req.body;
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id,
  });

  try {
    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    res.status(201).json(savedNote);
  } catch (exception) {
    next(exception);
  }
});

notesRouter.delete('/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

notesRouter.put('/:id', (req, res, next) => {
  const { content, important } = req.body;

  Note.findById(req.params.id).then((note) => {
    if (!note) {
      return res.status(404).end();
    }

    note.content = content;
    note.important = important;

    note
      .save()
      .then((updated) => res.json(updated))
      .catch((error) => next(error));
  });
});

module.exports = notesRouter;
