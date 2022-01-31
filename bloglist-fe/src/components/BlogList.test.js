import React from 'react'
import { Blog } from './BlogList'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('Blog', () => {
  const blog = {
    user: 'piccolo',
    title: 'testing blog',
    author: 'me',
    url: 'www.me.dev',
    likes: 69,
  }

  const user = { name: 'piccolo' }

  const handleLike = jest.fn()
  const removeBlog = jest.fn()

  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        loggedUser={user}
        handleLike={handleLike}
        removeBlog={removeBlog}
      />,
    )
  })

  it('displays title and author as the start', () => {
    const blogItem = screen.getByTestId('blog-item')
    expect(blogItem).toHaveTextContent(/testing blog me/i)
  })

  it('not displays url and likes as the start', () => {
    const blogItem = screen.getByTestId('blog-item')
    expect(blogItem).toHaveTextContent(/testing blog me/i)

    const urlElement = screen.getByTestId('blog-url')
    const likesElement = screen.getByTestId('blog-likes')

    expect(urlElement).not.toBeVisible()
    expect(likesElement).not.toBeVisible()
  })

  it('displays url and number of likes when view button clicked', () => {
    const viewBtn = screen.getByRole('button', { name: /view/i })
    fireEvent.click(viewBtn)
    const urlElement = screen.getByTestId('blog-url')
    const likesElement = screen.getByTestId('blog-likes')

    expect(urlElement).toHaveTextContent(/www.me.dev/i)
    expect(likesElement).toHaveTextContent(/likes 69/i)
  })

  it('calls handleLike twice if the like button is clicked twice', () => {
    const viewBtn = screen.getByRole('button', { name: /view/i })
    fireEvent.click(viewBtn)

    const likeBtn = screen.getByRole('button', { name: 'like' })
    fireEvent.click(likeBtn)
    fireEvent.click(likeBtn)

    expect(handleLike.mock.calls).toHaveLength(2)
  })
})
