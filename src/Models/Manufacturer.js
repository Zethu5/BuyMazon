const mongoose = require('mongoose')
const manufacturerSchema = new mongoose.Schema({
    name: String,
    logo: String,
    type: String,
    industry: String,
    owner: String,
})

module.exports.ManufacturerModel = mongoose.model('Manufacturer', manufacturerSchema)
module.exports.manufacturerSchema = manufacturerSchema