const mongoose = require('mongoose');
const { manufacturerSchema } = require('./Manufacturer');
const productSchema = new mongoose.Schema({
    name: String,
    picture: String,
    code: String,
    price: Number,
    weight: Number,
    weightUnit: String,
    ingredients: String,
    productionCountry: String,
    manufacturer: manufacturerSchema
})

module.exports.ProductModel = mongoose.model('Product', productSchema)
module.exports.productSchema = productSchema