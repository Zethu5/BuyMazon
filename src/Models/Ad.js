const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    info: String,
    products: [],
    discountType: Number,
    active: Boolean,
    startDate: Date,
    endDate: Date,
})

module.exports.AdModel = mongoose.model('Ad', adSchema)
module.exports.adSchema = adSchema