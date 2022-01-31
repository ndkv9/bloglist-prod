import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ notification }) => {
  if (!notification) return null

  const notificationStyle = notification.error ? 'error' : 'noti'

  return <div className={notificationStyle}>{notification.message}</div>
}

Notification.propTypes = {
  notification: PropTypes.node,
}

export default Notification
