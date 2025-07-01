const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/user')
const { beforeEach, after, test, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helper')
const app = require('../app')

const supertest = require('supertest')
const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('LeoLi', 10)
    const user = new User({ username: 'test', passwordHash })

    await user.save()
  })

  test('username must be 3 characters', async () => {
    const newUser = {
      username: 'le',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api.post('/api/users').send(newUser).expect(400)
  })

  test('password must be 3 characters', async () => {
    const newUser = {
      username: 'leooo',
      name: 'Matti Luukkainen',
      password: 'sa',
    }

    await api.post('/api/users').send(newUser).expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
