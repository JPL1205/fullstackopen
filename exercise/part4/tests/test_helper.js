const Note = require('../models/note');

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
];

const notesInDB = async () => {
  const notes = await Note.find({});
  return notes.map((n) => n.toJSON());
};

module.exports = {
  initialNotes,
  notesInDB,
};
