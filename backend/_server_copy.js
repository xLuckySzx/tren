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
mongoose.connect(dbUri, { useNewUrlParser: true, useCreateIndex: true })
.then(() => console.log('MongoDB database connection successful'))
.catch((err) => console.error(err))
//////////////////////




// Passport config
let User = require('./models/user')
passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
        if(err) return done(err)
        if(!user) return done(null, false, { message: 'Incorrect username.' })
        if(!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.'})
        }
        return done(null, user)
    })
}))
passport.serializeUser(User.serialize())
passport.deserializeUser(User.deserialize())
//////////////////

// Middleware configuration
srv.use(express.json())
srv.use(morgan('dev'))
srv.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ 
        mongooseConnection: mongoose.connection,
        touchAfter: 60 * 60 * 24
    }),
    cookie: {
        maxAge: 60 * 60 * 24 * 60
    }
}))
srv.use(passport.initialize())
srv.use(passport.session())
///////////////////////////

// Routers configuration
require('./models/user')
const userRouter = require('./routes/user')

srv.use('/users', userRouter)
////////////////////////

// Server start
srv.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})