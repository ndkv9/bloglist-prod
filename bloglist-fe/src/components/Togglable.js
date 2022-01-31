import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const Togglable = props => {
  const [visible, setVisible] = useState(null)

  useEffect(() => {
    props.focusTitle()
  })

  const hideWhenVisibility = { display: visible ? 'none' : '' }
  const showWhenVisibility = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisibility}>
        <button
          onClick={() => {
            toggleVisibility()
          }}
        >
          {props.btnLabel}
        </button>
      </div>
      <div style={showWhenVisibility}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

Togglable.propTypes = {
  btnLabel: PropTypes.string.isRequired,
  focusTitle: PropTypes.func.isRequired,
}

export default Togglable
