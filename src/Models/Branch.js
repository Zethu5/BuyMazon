const mongoose = require('mongoose')
const branchesSchema = new mongoose.Schema({
    city: String,
    address: String,
    phone: String,
    picture: String,
    coordinates: {
        lat: Number,
        lng: Number
    }
})

module.exports.BranchesModel = mongoose.model('Branch', branchesSchema)
module.exports.branchesSchema = branchesSchema