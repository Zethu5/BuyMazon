const mongoose = require('mongoose')
const { productSchema } = require('./Product');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    creationDate: Date,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    isAdmin: Boolean,
    products: []
})

module.exports.UserModel = mongoose.model('User', userSchema)
module.exports.userSchema = userSchema