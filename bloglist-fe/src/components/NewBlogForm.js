import React, { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlogForm = React.forwardRef((props, ref) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    props.createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog} data-testid='blog-form'>
      <div>
        title:
        <input
          ref={ref}
          data-testid='blog-title'
          type='text'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          data-testid='blog-author'
          type='text'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          data-testid='blog-url'
          type='text'
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  )
})

NewBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

NewBlogForm.displayName = 'Togglable'

export default NewBlogForm
