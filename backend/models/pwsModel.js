const { ObjectId } = require('bson')
const mongoose = require('mongoose')

const pwSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        require: true
    },
    company: {
        type: String,
        require: [true, 'Please, type the name of the company.']
    },
    username: {
        type: String,
        require: [true, 'Please, type your username.']
    },
    email: {
        type: String
    },
    password: {
        type: Object,
        required: [true, 'Please, type your password.']
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Pw', pwSchema)