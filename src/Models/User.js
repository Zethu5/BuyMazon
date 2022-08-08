const mongoose = require('mongoose')
const { productSchema } = require('./Product');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    creationDate: Date,
    age: Number,
    admin: Boolean,
    products: [productSchema]
})

module.exports.UserModel = mongoose.model('User', userSchema)
module.exports.userSchema = userSchema