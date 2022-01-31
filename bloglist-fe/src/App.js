import React, { useState, useEffect, useRef } from 'react'
import { BlogList } from './components/BlogList'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      const noti = { message: exception.response.data.error, error: true }
      displayNoti(noti)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const handleCreate = async obj => {
    try {
      const savedBlog = await blogService.create(obj)
      const blogObj = {
        title: savedBlog.title,
        author: savedBlog.author,
        url: savedBlog.url,
        likes: savedBlog.likes,
        id: savedBlog.id,
      }

      const noti = {
        message: `added ${savedBlog.title} by ${savedBlog.author}`,
      }

      setBlogs(prev => prev.concat(blogObj))
      displayNoti(noti)
    } catch (exception) {
      const noti = { message: exception.response.data.error, error: true }
      displayNoti(noti)
    }
  }

  const handleLike = async (id, blogObj) => {
    try {
      const updatedBlog = await blogService.update(id, blogObj)

      setBlogs(prev => {
        const blogs = prev.map(blog => (blog.id === id ? updatedBlog : blog))
        return blogs
      })
    } catch (exception) {
      const noti = { message: exception.response.data.error, error: true }
      displayNoti(noti)
    }
  }

  const removeBlog = async id => {
    try {
      await blogService.remove(id)

      setBlogs(prev => {
        const blogs = prev.filter(blog => blog.id !== id)
        return blogs
      })
    } catch (exception) {
      const noti = { message: exception.response.data.error, error: true }
      displayNoti(noti)
    }
  }

  const displayNoti = noti => {
    setNotification(noti)

    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const displayLoginForm = () => {
    return (
      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    )
  }

  const titleRef = useRef()

  const focusTitle = () => {
    titleRef.current.focus()
  }

  const displayBlogs = () => {
    const loggedInStyle = {
      color: 'orange',
    }

    return (
      <div>
        <p style={loggedInStyle}>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>

        <Togglable btnLabel='new blog' focusTitle={focusTitle}>
          <h2>create new</h2>

          <NewBlogForm createBlog={handleCreate} ref={titleRef} />
        </Togglable>

        <br />

        <BlogList
          blogs={blogs}
          handleLike={handleLike}
          removeBlog={removeBlog}
          loggedUser={user}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>{!user ? 'log in to application' : 'blogs'}</h2>

      <Notification notification={notification} />

      {!user ? displayLoginForm() : displayBlogs()}
    </div>
  )
}

export default App
