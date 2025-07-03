const Note = require('../models/note');
const User = require('../models/user');

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

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialNotes,
  notesInDB,
  usersInDB,
};
