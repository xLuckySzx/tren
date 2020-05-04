const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const foodSchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        index: true,
        match: [/([a-zA-Z0-9 ]*)/, 'contains invalid characters'],
    },
    desc: {
        type: String,
        trim: true
    },
    nutrition: {
        calories: Number,
        carbs: Number,
        sugar: Number,
        fiber: Number,
        fats: Number,
        satfats: Number,
        protein: Number
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
})

foodSchema.plugin(uniqueValidator, { message: 'already exists' })

const Food = mongoose.model('Food', foodSchema)
module.exports = Food
