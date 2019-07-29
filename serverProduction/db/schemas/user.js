const mongoose = require('mongoose')
const {Schema} = mongoose
const ObjectId = mongoose.SchemaTypes.ObjectId

const userSchema = new Schema({
     
    name: {
        type: String,
        trim: true,
        required: true
    },
    avatarSrc: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        default: '123'
    }
})

module.exports = userSchema