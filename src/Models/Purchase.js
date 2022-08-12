const mongoose = require('mongoose');
// const { manufacturerSchema } = require('./Manufacturer');

const purchaseSchema = new mongoose.Schema({
    addressInformation: {
        firstName: String,
        lastName: String,
        firstAddress: String,
        secondAddress: String  || null,
        city: String,
        region: String,
        zipCode: String,
        phone: String,
        email: String,
    },
    billingInformation: {

    }
})

module.exports.PurchaseModel = mongoose.model('Purcahse', purchaseSchema)
module.exports.purchaseSchema = purchaseSchema