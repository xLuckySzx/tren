const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const bcrypt = require('bcryptjs')

// Register strategy
passport.use('register', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false,
},
(username, password, done) => {
    User.findOne({ username: username })
        .then(user => {
            if(user != null) {
                console.log('username already taken')
                return done(null, false, { message: 'username already exists' })
            } else {
                bcrypt.hash(password, Number(process.env.HASH_ITERS))
                    .then(hash => {
                        // Create user
                        User.create({
                            username,
                            hash,
                        }).then(user => {
                            console.log(`User created: ${username}`)
                            return done(null, user)
                        }).catch(err => {
                            console.log(err)
                            done(err)
                        })
                    })
                    .catch(err => {

                    })
            }
        })
        .catch(err => {
            console.log(err)
            done(err)
        })
}))

// Login strategy
passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false,
},
(username, password, done) => {
    User.findOne({ $or: [ { username: username }, { email: username }] })
        .then(user => {
            if(user == null ) return done(null, false, { message: 'username or email not found'})
            else {
                // @ts-ignore
                bcrypt.compare(password, user.hash)
                    .then(result => {
                        if(result) {
                            console.log('login successful')
                            return done(null, user)
                        }
                        return done(null, false, { message: 'password not recognized'})
                    })
                    .catch(err => {
                        console.log(err)
                        return done(err)
                    })
            }
        })
        .catch(err => {

        })
}))

// JSON Web Tokens strategy
passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: process.env.SECRET
},
(jwt_payload, done) => {
    User.findOne({ username: jwt_payload.id })
        .then(user => {
            if(user) {
                console.log('jwt user found')
                done(null, user)
            } else {
                console.log('jwt user NOT found')
                done(null, false)
            }
        })
        .catch(err => {
            console.log(err)
            done(err)
        })
}))