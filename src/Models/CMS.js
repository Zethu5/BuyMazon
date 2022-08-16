const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema({
    array0: [],
    array1: [],
    array2: []
})

module.exports.CMSModel = mongoose.model('CMS', cmsSchema)
module.exports.cmsSchema = cmsSchema