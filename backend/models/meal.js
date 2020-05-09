const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const mealSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['breakfast', 'lunch', 'dinner', 'snack', 'other']
    },
    desc: {
        type: String,
        trim: true
    },
    date: Schema.Types.Date,
    foods: [{
        type: Schema.Types.ObjectId,
        ref: 'Food'
        /* validate: {
            isAsync: true,
            validator: function(v) {
                
            }
        } */
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
})

mealSchema.plugin(uniqueValidator, { message: 'already exists' })

const Food = mongoose.model('Meal', mealSchema)
module.exports = Food
