import React from 'react'
import NewBlogForm from './NewBlogForm'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('NewBlogForm', () => {
  const createBlog = jest.fn()

  beforeEach(() => {
    render(<NewBlogForm createBlog={createBlog} />)
  })

  it('calls the event handler it received as props with the right details', () => {
    const titleElement = screen.getByTestId('blog-title')
    const authorElement = screen.getByTestId('blog-author')
    const urlElement = screen.getByTestId('blog-url')
    const blogForm = screen.getByTestId('blog-form')

    const blogData = {
      author: 'Martin Fowler',
      title: 'Continuous Integration',
      url: 'https://martinfowler.com/articles/continuousIntegration.html',
    }

    fireEvent.change(titleElement, { target: { value: blogData.title } })
    fireEvent.change(authorElement, { target: { value: blogData.author } })
    fireEvent.change(urlElement, { target: { value: blogData.url } })
    fireEvent.submit(blogForm)

    expect(createBlog.mock.calls.length).toBe(1)
    expect(createBlog.mock.calls[0][0]).toEqual(blogData)
  })
})
