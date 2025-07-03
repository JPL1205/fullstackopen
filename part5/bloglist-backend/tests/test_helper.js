const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'MongoDB Schema Design Best Practices',
    author: 'Alex Chen',
    url: 'https://blog.example.com/mongodb-schema',
    likes: 11,
  },
  {
    title: 'Leo personal history',
    author: 'Leo Li',
    url: 'https://blog.example.com/mongodb-schemaaa',
    likes: 0,
  },
]

const BlogsInDB = async () => {
  const blogs = await Blog.find({})
  console.log('test helper look blogs', blogs)
  return blogs.map((b) => b.toJSON())
}

const UserInDB = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const createTestUserAndToken = async () => {
  const passwordHash = await bcrypt.hash('testpass', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  return { token, user }
}
module.exports = { initialBlogs, BlogsInDB, UserInDB, createTestUserAndToken }
