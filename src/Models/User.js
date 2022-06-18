const mongoose = require('mongoose')
const Product = require('./Product')
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    creationDate: Date,
    age: Number,
    products: [Product]
})

module.exports = mongoose.model('User', userSchema)