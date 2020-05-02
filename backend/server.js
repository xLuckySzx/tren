const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const morgan = require('morgan')

require('dotenv').config()

// ENV Variables
if(isNaN(Number(process.env.HASH_ITERS))) {
    console.error('Fatal error: missing HASH_ITERS environment variable.')    
    process.exit(1)
}
if(process.env.SECRET == null || typeof process.env.SECRET == undefined) {
    console.error('Fatal error: missing SECRET environment variable.')    
    process.exit(1)
}
////////////////

const srv = express()
const port = process.env.PORT || 3000

// Mongoose connection
mongoose.Promise = global.Promise
const dbUri = process.env.ATLAS_URI
mongoose.connect(dbUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true })
.then(() => console.log('MongoDB database connection successful'))
.catch((err) => console.error(err))
//////////////////////

require('./auth/passport')

// Middleware configuration
srv.use(express.json())
srv.use(morgan('dev'))
srv.use(passport.initialize())
///////////////////////////

// Routers configuration
require('./models/user')
const userRouter = require('./routes/user')

srv.use('/user', userRouter)
////////////////////////

// Server start
srv.listen(port, () => {
    console.log(`Server is listening on port: ${port}`)
})

module.exports = srv