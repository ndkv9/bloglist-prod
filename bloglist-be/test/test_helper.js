const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Clean Code',
    author: 'Uncle Bob',
    url: 'www.unclebob.dev',
  },

  {
    title: 'Pragmatic Programmer',
    author: 'Uncle Stan',
    url: 'www.unclestan.dev',
  },
]

const initialUsers = [
  {
    username: 'saiyan1',
    name: 'vegeta',
    password: 'secret',
  },
  {
    username: 'namekian1',
    name: 'piccolo',
    password: 'secret',
  },
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDB,
  initialUsers,
  usersInDB,
}
