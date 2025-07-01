const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res, next) => {
  const user = req.user
  const body = req.body

  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    user: user._id,
    url: body.url,
    likes: body.likes || 0,
  })

  try {
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id
  const user = req.user
  console.log(user)

  const blog = await Blog.findById(id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: 'unauthorized: not the blog owner' })
  }

  try {
    await Blog.findByIdAndDelete(id)
    user.blogs = user.blogs.filter((b) => b.toString() !== id.toString())
    await user.save()
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  const { title, author, url, likes } = req.body

  try {
    const blogToUpdate = await Blog.findById(req.params.id)
    if (!blogToUpdate) {
      return res.status(404).end()
    }

    blogToUpdate.title = title
    blogToUpdate.author = author
    blogToUpdate.url = url
    blogToUpdate.likes = likes

    const saved = await blogToUpdate.save()
    res.json(saved)
  } catch (err) {
    next(err)
  }
})

module.exports = blogsRouter
