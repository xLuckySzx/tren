const passport = require('passport')
const router = require('express').Router();
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

router.get('/:name', (req, res) => {
    Food.findOne({ name: req.params.name }).lean().select('-_id').populate('creator', '-hash')
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

router.post('/add', (req, res) => {
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

module.exports = router