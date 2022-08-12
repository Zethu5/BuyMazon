const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
        cardNumber: String,
        nameOnCard: String,
        expirationDate: Date,
        securityCode: String
    }
})

module.exports.OrderModel = mongoose.model('Purcahse', orderSchema)
module.exports.orderSchema = orderSchema