const mongoose = require('mongoose')
const manufacturerSchema = new mongoose.Schema({
    name: String,
    picture: String,
    type: String,
    industry: String,
    founder: String,
    owner: String,
})

module.exports.Manufacturer = mongoose.model('Manufacturer', manufacturerSchema)
module.exports.manufacturerSchema = manufacturerSchema