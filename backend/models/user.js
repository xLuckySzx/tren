const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        index: true,
        match: [/([aA-zZ0-9_.-]){3,}$/, 'is invalid'],
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
    },
    bio: String,
    image: String,
    hash: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

userSchema.plugin(uniqueValidator, { message: 'is already taken' })

const User = mongoose.model('User', userSchema)
module.exports = User
