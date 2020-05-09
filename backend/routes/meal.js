const passport = require('passport')
const router = require('express').Router();
const Meal = require('../models/meal')

router.all('/*', passport.authenticate('jwt', { session: false }))

router.get('/', (req, res) => {
    console.log(req.user)
    Meal.find().select('-_id')
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
    Meal.findOne({ _id: req.params.id })
        .lean()
        .populate('creator', '-hash')
        .populate('foods')
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
    Meal.create({
        type: req.body.type,
        desc: req.body.desc,
        date: req.body.date,
        foods: req.body.foods,
        // @ts-ignore
        owner: req.user._id
    }).then(meal => {
        // @ts-ignore
        console.log(`${req.user.username} successfully created ${meal}`)
        res.send(meal)
    }).catch(err => {
        console.log(err)
        res.send({
            error: true,
            message: err
        })
    })
})

module.exports = router