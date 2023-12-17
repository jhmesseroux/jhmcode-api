require('dotenv').config()
process.on('uncaughtException', (err) => {
  console.log(err.name, ' | ', err.message)
  console.log('UNCAUGHT EXCEPTION!!! . SHUTTING DOWN THE APP...')
  process.exit(1)
})

const app = require('./app')

const server = app.listen(process.env.PORT, () => {
  console.log(`APP RUNNING ON PORT: ${process.env.PORT} IN MODE: ${process.env.NODE_ENV}`)
})

process.on('unhandledRejection', (err) => {
  console.log(err.name, ' | ', err.message)
  console.log('UNHANDLED REJECTION PROBLEM . SHUTTING DOWN THE APP...')
  server.close(() => {
    process.exit(1)
  })
})
