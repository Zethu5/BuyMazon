const mongoose = require('mongoose');
const { Product } = require('./Product');

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
    },
    products: [],
    price: Number,
    userId: String
})

module.exports.OrderModel = mongoose.model('Order', orderSchema)
module.exports.orderSchema = orderSchema