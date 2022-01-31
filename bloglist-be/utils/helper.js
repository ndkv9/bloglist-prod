const _ = require('lodash')

const dummy = arr => {
  console.log(arr)
  return 1
}

const totalLikes = arr => {
  if (arr.length === 0) return 0
  if (arr.length === 1) return arr[0].likes

  return arr.map(blog => blog.likes).reduce((a, i) => a + i, 0)
}

const favoriteBlog = arr => {
  if (arr.length === 0) return undefined
  if (arr.length === 1) return arr[0]

  return arr.find(
    result => result.likes === Math.max(...arr.map(blog => blog.likes)),
  )
}

const mostBlogs = arr => {
  if (arr.length === 0) return undefined
  if (arr.length === 1) return { author: arr[0].author, blogs: 1 }

  const mostOccurence = _.head(
    _(arr.map(blog => blog.author))
      .countBy()
      .entries()
      .maxBy(_.last),
  )
  const amount = arr.filter(blog => blog.author === mostOccurence).length

  return { author: mostOccurence, blogs: amount }
}

const getToken = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.slice(7)
  }

  return null
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, getToken }
