const mongoose = require('mongoose');
const { manufacturerSchema } = require('./Manufacturer');
const productSchema = new mongoose.Schema({
    name: String,
    picture: String,
    id: String,
    price: Number,
    weight: String,
    ingredients: String,
    productionCountry: String,
    manufacturer: manufacturerSchema
})

module.exports.Product = mongoose.model('Product', productSchema)
module.exports.productSchema = productSchema