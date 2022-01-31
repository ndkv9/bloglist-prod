import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
}) => {
  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const inputRef = useRef(null)

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          ref={inputRef}
          type='text'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>

      <button type='submit'>login</button>
    </form>
  )
}

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
}

export default LoginForm
