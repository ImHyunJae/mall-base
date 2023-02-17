if (process.env.NODE_ENV === 'production') {
  console.log('production mode')
  module.exports = require('./prod')
} else {
  console.log('dev mode')
  module.exports = require('./dev')
}
