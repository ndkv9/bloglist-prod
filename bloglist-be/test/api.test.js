const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  for (let user of helper.initialUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const userObj = new User({
      username: user.username,
      name: user.name,
      passwordHash,
    })

    await userObj.save()
  }

  const userCredential = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password,
  }

  const result = await api.post('/api/login').send(userCredential)
  const token = result.body.token
  const authorization = `bearer ${token}`

  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    await api.post('/api/blogs').send(blog).set('Authorization', authorization)
  }
})

describe('when users return from server', () => {
  test('users return with proper format', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('users return with proper amount', async () => {
    const users = await api.get('/api/users')
    expect(users.body).toHaveLength(helper.initialUsers.length)
  })

  test('return with specific user', async () => {
    const users = await api.get('/api/users')
    expect(users.body[0].username).toBe('saiyan1')
  })
})

describe('when a user logins', () => {
  test('login succeeds with proper credential', async () => {
    const userCredential = {
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password,
    }

    await api
      .post('/api/login')
      .send(userCredential)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('login returns with token', async () => {
    const userCredential = {
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password,
    }

    const result = await api.post('/api/login').send(userCredential)
    expect(result.body.username).toBe(helper.initialUsers[0].username)
    expect(result.body.token).toBeDefined()
  })
})

describe('when return blogs from server', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs at the beginning', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    expect(titles).toContain('Pragmatic Programmer')
  })
})

describe('adds a new blog without token', () => {
  test('will be failed with proper code', async () => {
    const blog = {
      title: 'My Testing Blog',
      author: 'Me',
      url: 'www.myblog.me',
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('a blog with proper token', () => {
  let token = null
  let authorization = null
  beforeEach(async () => {
    const userCredential = {
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password,
    }

    const result = await api.post('/api/login').send(userCredential)
    token = result.body.token
    authorization = `bearer ${token}`
    expect(token).toBeTruthy()
  })

  test('can be added succeed with proper status code', async () => {
    const newBlog = {
      title: 'testing blog with token',
      author: 'tui',
      url: 'www.testing.me',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', authorization)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('blog without title and url cannot be added', async () => {
    const blog = {
      author: 'Me',
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .set('Authorization', authorization)
      .expect(400)
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('can be viewed as expected', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToView = blogsAtStart[0]

    const returnedBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .set('Authorization', authorization)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
    expect(returnedBlog.body).toEqual(processedBlogToView)
  })

  test('can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToDel = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDel.id}`)
      .set('Authorization', authorization)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()
    const titles = blogsAtEnd.map(b => b.title)

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    expect(titles).not.toContain(blogToDel.title)
  })

  test('can be verified id property', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .set('Authorization', authorization)
      .expect('Content-Type', /application\/json/)

    blogs.body.map(b => {
      expect(b.id).toBeDefined()
    })
  })

  test('has likes property values is 0 if it is missing', async () => {
    const blogToSave = {
      title: 'testing blog',
      author: 'Me',
      url: 'www.ahihi.me',
    }

    await api
      .post('/api/blogs')
      .send(blogToSave)
      .set('Authorization', authorization)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    const addedBlog = blogsAtEnd.find(b => b.url === blogToSave.url)
    expect(addedBlog.likes).toBe(0)
  })
})

describe('update a blog', () => {
  test('a property can be updated', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogToUpdate = blogs.body[0]
    blogToUpdate.likes = 69

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    expect(updatedBlog.body.likes).toBe(69)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
