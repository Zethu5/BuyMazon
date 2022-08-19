const express = require('express')
const mongoose = require('mongoose')
const { ProductModel } = require('../Models/Product')

require('dotenv').config({path:__dirname + '../../.env'})

mongoose.connect(process.env.mongo_db_connection_uri);
let router = express.Router()


router
.route('/')
.get(async (req, res) => {
    res.json(await ProductModel.find().exec())
})
.post(async (req, res) => {
    const product = new ProductModel(req.body)
    await product.save()
    const socket = req.app.get('socket')
    socket.emit('productUpdate')
    res.json({result: 'Added product ' + product._id})
})

router
.route('/:id')
.get(async (req, res) => {
    res.json(await ProductModel.find({id: req.params.id}).exec())
})
.put(async (req, res) => {
    await ProductModel.findOneAndUpdate({_id: req.params.id}, req.body)
    const socket = req.app.get('socket')
    socket.emit('productUpdate')
    res.json({result: 'Updated product ' + req.params.id})
})
.delete(async (req, res) => {
    await ProductModel.findOneAndDelete({_id: req.params.id})
    const socket = req.app.get('socket')
    socket.emit('productUpdate')
    socket.emit('userCartUpdate')
    res.json({result: 'Deleted product ' + req.params.id})
})


module.exports = router