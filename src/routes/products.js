const express = require('express')
const mongoose = require('mongoose')
const { ProductModel } = require('../Models/Product')

let router = express.Router()
mongoose.connect('mongodb://localhost:27017/BuyMazon');

router
.route('/')
.get(async (req, res) => {
    res.json(await ProductModel.find().exec())
})
.post(async (req, res) => {
    const product = new ProductModel(req.body)
    await product.save()
    res.json({result: 'Added product ' + product._id})
})

router
.route('/:id')
.get(async (req, res) => {
    res.json(await ProductModel.find({id: req.params.id}).exec())
})
.put(async (req, res) => {
    await Product.findOneAndUpdate({_id: req.params.id}, req.body)
    res.json({result: 'Updated product ' + req.params.id})
})
.delete(async (req, res) => {
    await Product.findOneAndDelete({_id: req.params.id})
    res.json({result: 'Deleted product ' + req.params.id})
})


module.exports = router