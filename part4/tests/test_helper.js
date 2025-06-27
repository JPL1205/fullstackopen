const Blog = require('../models/blog')

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

module.exports = { initialBlogs, BlogsInDB }
