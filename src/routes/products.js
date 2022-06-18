const express = require('express')
const mongoose = require('mongoose')
const { Product } = require('../Models/Product')

let router = express.Router()
mongoose.connect('mongodb://localhost:27017/BuyMazon');

router
.route('/')
.get(async (req, res) => {
    res.sendStatus(200).json(await Product.find().exec())
})
.post(async (req, res) => {
    const product = new Product(req.body.product)
    await Product.save(product)
    res.sendStatus(200).send('Added product ' + req.body.product.id)
})

router
.route('/:id')
.get(async (req, res) => {
    res.sendStatus(200).json(await Product.find({id: req.params.id}).exec())
})
.put(async (req, res) => {
    await Product.findOneAndUpdate({id: req.params.id}, req.body.product)
    res.sendStatus(200).send('Updated product ' + req.params.id)
})
.delete(async (req, res) => {
    await Product.findOneAndDelete({id: req.params.id})
    res.sendStatus(200).send('Deleted product ' + req.params.id)
})


module.exports = router