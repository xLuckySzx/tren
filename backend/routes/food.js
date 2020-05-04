const passport = require('passport')
const router = require('express').Router();
const User = require('../models/user')
const Food = require('../models/food')

router.all('/*', passport.authenticate('jwt', { session: false }))

router.get('/', (req, res) => {
    console.log(req.user)
    Food.find().select('-_id')
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            console.log(err)
            res.send({
                error: true,
                message: err
            })
        })
})

router.get('/:id', (req, res) => {
    Food.findOne({ _id: req.params.id }).select('-_id')
        .then(food => {
            res.send(food)
        })
        .catch(err => {
            console.log(err)
            res.send({
                error: true,
                message: err
            })
        })
})

router.post('/add', (req, res, next) => {
    Food.create({
        name: req.body.name,
        desc: req.body.desc,
        nutrition: req.body.nutrition,
        // @ts-ignore
        creator: req.user._id
    }).then(food => {
        // @ts-ignore
        console.log(`${req.user.username} successfully created ${food}`)
        res.send(food)
    }).catch(err => {
        console.log(err)
        res.send({
            error: true,
            message: err
        })
    })
})



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

module.exports = router