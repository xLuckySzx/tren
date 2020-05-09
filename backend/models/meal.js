const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const mealSchema = new Schema({
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
