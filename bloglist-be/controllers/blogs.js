const Blog = require('../models/blog.js')
const express = require('express')
const blogsRouter = express.Router()

blogsRouter.get('/', async (_req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body
  const user = req.user

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'missing title and url' })
  }

  if (user) {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    return res.status(201).json(savedBlog)
  }

  return res
    .status(401)
    .json({ error: 'cannot create new blog without authorization' })
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blogObj = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const savedBlog = await Blog.findByIdAndUpdate(req.params.id, blogObj, {
    new: true,
  }).populate('user', { username: 1, name: 1 })

  res.json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const user = req.user

  if (user) {
    const blog = await Blog.findById(req.params.id)

    if (user._id.toString() === blog.user.toString()) {
      await blog.remove()
      user.blogs = user.blogs.filter(b => b.id.toString() !== req.params.id)
      await user.save()
      return res.status(204).end()
    }

    return res
      .status(400)
      .json({ error: 'blog can only be deleted by its owner' })
  }

  return res
    .status(401)
    .json({ error: 'cannot delete a blog without authorization' })
})

module.exports = blogsRouter
