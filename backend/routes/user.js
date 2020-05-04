const jwt = require('jsonwebtoken')
const passport = require('passport')
const router = require('express').Router();
const User = require('../models/user')

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(req.user)
})

// Login routes
router.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if(err) {
            console.log(err)
        }
        if(info !== undefined) {
            console.log(info.message)
            res.send(info.message)
        } else {
            req.logIn(user, err => {
                User.findOne({ username: user.username })
                    .then(user => {
                        let token = jwt.sign({ 
                            // @ts-ignore
                            id: user.username,
                        }, process.env.SECRET, { expiresIn: '30d' })
                        res.status(200).send({
                            auth: true,
                            token: token,
                            message: 'login successful'
                        })
                    })
            })
        }
    })(req, res, next)
})
///////////////

// Register routes
router.post('/register', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if(err) {
            console.log(err)
        }
        if(info !== undefined) {
            console.log(info.message)
            res.send(info.message)
        } else {
            req.logIn(user, err => {
                const data = {
                    email: req.body.email,
                    bio: req.body.bio
                }

                User.findOne({ username: user.username })
                    .then(user => {
                        user.updateOne({
                            // Add additional information
                            // TODO: add image
                            email: data.email,
                            bio: data.bio
                        })
                        .then(() => {
                            console.log('user created')
                            res.status(200).send({ message: 'registration successful' })
                        })
                    })
            })
        }
    })(req, res, next)
})
//////////////////

module.exports = router