const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({ username: body.username })

  const correctPassword = user
    ? await bcrypt.compare(body.password, user.passwordHash)
    : false

  if (!(user && correctPassword)) {
    return res.status(401).json({ error: 'invalid credentials' })
  }

  const payload = {
    username: user.username,
    id: user._id,
  }

  const HOUR = 3600
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: HOUR })

  res.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
