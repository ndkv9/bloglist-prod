const app = require('./app.js')
const http = require('http')
const logger = require('./utils/logger.js')
const config = require('./utils/config.js')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
