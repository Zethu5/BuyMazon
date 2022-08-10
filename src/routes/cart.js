const express = require('express')
const mongoose = require('mongoose')
const { UserModel } = require('../Models/User')

let router = express.Router()
mongoose.connect('mongodb://localhost:27017/BuyMazon');


router
.route('/:id/addproduct')
.put(async (req, res) => {
    let user = await UserModel.findOne({_id: req.params.id}).exec()

    const product = req.body.product
    user.products.push(product)
    await user.save()

    const socket = req.app.get('socket')
    socket.emit('userCartUpdate')

    res.json({result: `Added ${product.name} to ${user.username}`})
})

router
.route('/:id/cart')
.get(async (req, res) => {
    const user = await UserModel.findOne({_id: req.params.id}).exec()
    let products = [...user.products]
    res.json(products)
})

module.exports = router