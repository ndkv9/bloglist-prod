const jwt = require('jsonwebtoken')
const User = require('../models/user')

const unknownEndpoint = (_req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

const tokenExtractor = (req, _res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    req.token = authorization.slice(7)
  }

  next()
}

const userExtractor = async (req, res, next) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, process.env.SECRET_KEY)

    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ error: 'token is missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    req.user = user
  }

  next()
}

const errorHandler = (error, _request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (
    error.name === 'ValidationError' &&
    error.message.includes('expected `username` to be unique')
  ) {
    return response.status(400).json({ error: 'username must be unique' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'missing or invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
