const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')

const api = supertest(app)

const { initialBlogs, BlogsInDB } = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('clear')
  await Blog.insertMany(initialBlogs)
})

test('can make valid get request', async () => {
  const blogs = await api.get('/api/blogs')
  //   console.log(blogs.body)

  assert.strictEqual(blogs.body.length, 2)
})

test('_id set to id correctly', async () => {
  const blogs = await api.get('/api/blogs')
  const firstBlog = blogs.body[0]

  //   console.log(firstBlog)

  assert(!('_id' in firstBlog))
})

test('Can add blog to DB', async () => {
  //   const blogsBeforeAdd = await BlogsInDB()

  const newBlog = {
    title: 'Understanding Node.js Streams',
    author: 'Jane Doe',
    url: 'https://blog.example.com/node-streams',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfterAdd = await BlogsInDB()
  console.log(blogsAfterAdd)

  const titles = blogsAfterAdd.map((b) => b.title)

  assert.strictEqual(blogsAfterAdd.length, initialBlogs.length + 1)
  //   console.log(titles)

  assert(titles.includes('Understanding Node.js Streams'))
})

test('without likes default to 0', async () => {
  const newBlog = {
    title: 'without likes default to 0',
    author: 'Jane',
    url: 'https://blog.example.com/node-streams',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await BlogsInDB()
  const blogsAdded = blogs.find((b) => b.title === newBlog.title)
  console.log('added blog', blogsAdded)

  assert.strictEqual(blogsAdded.likes, 0)
})

test('required url and titles', async () => {
  const MissingTitle = {
    author: 'Jane',
    url: 'https://blog.example.com/node-streams',
  }

  const MissingUrl = {
    title: 'missing url',
    author: 'Jane',
  }

  await api.post('/api/blogs').send(MissingTitle).expect(400)

  await api.post('/api/blogs').send(MissingUrl).expect(400)
})

test('remove specific blog', async () => {
  const blogs = await BlogsInDB()
  const blogToRemove = blogs[0]

  await api.delete(`/api/blogs/${blogToRemove.id}`).expect(204)

  const blogsAfter = await BlogsInDB()
  const titles = blogsAfter.map((b) => b.title)
  assert(!titles.includes(blogToRemove.title))
  assert.strictEqual(blogsAfter.length + 1, initialBlogs.length)
})

test('put request', async () => {
  const blogs = await BlogsInDB()
  const blogToUpdate = blogs[0]

  const updateBlog = {
    title: 'Update',
    author: 'Update',
    url: 'Update',
    likes: blogToUpdate.likes,
  }

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updateBlog).expect(200)
  const blogsAfter = await BlogsInDB()
  const titles = blogsAfter.map((b) => b.title)
  assert(titles.includes(updateBlog.title))

  const updated = blogsAfter.find((b) => b.id === blogToUpdate.id)
  assert.deepStrictEqual(updated, { ...updateBlog, id: blogToUpdate.id })
})

after(async () => {
  await mongoose.connection.close()
})
