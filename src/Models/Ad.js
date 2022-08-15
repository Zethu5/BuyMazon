const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    info: String,
    publisher: String,
    active: Boolean
})

module.exports.AdModel = mongoose.model('Ad', adSchema)
module.exports.adSchema = adSchema