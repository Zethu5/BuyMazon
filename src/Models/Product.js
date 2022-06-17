const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    name: String,
    picture: String,
    code: String,
    price: Number,
    units: Number,
    weight: String,
    ingredients: String,
    productionCountry: String,
    manufacturer: String,
})

module.exports = mongoose.model('Product', productSchema)