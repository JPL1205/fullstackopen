const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const { initialNotes, notesInDB } = require('./test_helper');
const Note = require('../models/note');

const api = supertest(app);

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(initialNotes);
  // console.log('done');

  // initialNotes.forEach(async (n) => {
  //   let noteObject = new Note(n);
  //   // creating new Note required
  //   // .save belong to Mongoose object
  //   await noteObject.save();
  //   console.log('saved');
  // });

  // console.log('done');
});

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all notes are returned', async () => {
  const response = await api.get('/api/notes');

  assert.strictEqual(response.body.length, initialNotes.length);
});

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes');

  const content = response.body.map((e) => e.content);

  assert.strictEqual(content.includes('HTML is easy'), true);
});

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  };

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const notesAtEnd = await notesInDB();
  //   console.log(response);
  const content = notesAtEnd.map((e) => e.content);
  console.log(content);

  assert.strictEqual(content.length, initialNotes.length + 1);
  assert(content.includes('async/await simplifies making async calls'));
});

test('without content will not be saved to DB', async () => {
  const newNote = {
    important: true,
  };

  await api.post('/api/notes').send(newNote).expect(400);

  const notesAtEnd = await notesInDB();

  assert.strictEqual(notesAtEnd.length, initialNotes.length);
});

test('a specific note can be view', async () => {
  const notesAtStart = await notesInDB();
  const firstNote = notesAtStart[0];

  const resultNote = await api
    .get(`/api/notes/${firstNote.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.deepStrictEqual(resultNote.body, firstNote);
});

test('a specific note can be removed', async () => {
  const notesbefore = await notesInDB();
  const firstNote = notesbefore[0];

  await api.delete(`/api/notes/${firstNote.id}`).expect(204);

  const notesAfter = await notesInDB();
  const contents = notesAfter.map((n) => n.content);

  assert(!contents.includes(firstNote.content));

  assert.strictEqual(notesAfter.length, initialNotes.length - 1);
});

after(async () => {
  await mongoose.connection.close();
});
