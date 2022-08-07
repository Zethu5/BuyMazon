const express = require('express')
const mongoose = require('mongoose')
const { ManufacturerModel } = require('../Models/Manufacturer')
const { ProductModel } = require('../Models/Product')

let router = express.Router()
mongoose.connect('mongodb://localhost:27017/BuyMazon');


router
.route('/')
.get(async (req, res) => {
    res.json(await ManufacturerModel.find().exec())
})
.post(async (req, res) => {
    const manufacturer = new ManufacturerModel(req.body)
    await manufacturer.save()
    const socket = req.app.get('socket')
    socket.emit('manufacturerUpdate')
    res.json({'created object': manufacturer._id})
})

router
.route('/:id')
.get(async (req, res) => {
    res.json(await ManufacturerModel.find({_id: req.params.id}).exec())
})
.put(async (req, res) => {
    await ManufacturerModel.findOneAndUpdate({_id: req.params.id}, req.body)
    const socket = req.app.get('socket')
    socket.emit('manufacturerUpdate')
    res.json({result: 'Updated manufacturer ' + req.params.id})
})
.delete(async (req, res) => {
    await ManufacturerModel.findOneAndDelete({_id: req.params.id})
    const socket = req.app.get('socket')
    socket.emit('manufacturerUpdate')
    res.json({result: 'Deleted manufacturer ' + req.params.id})
})

router
.route('/:id/num_products')
.get(async (req, res) => {
    const result = await ProductModel.aggregate([
        {$unwind: '$manufacturer'},
        {$match: {'manufacturer._id': mongoose.Types.ObjectId(req.params.id)}},
        {$group: {_id: '$manufacturer._id', count: {$sum: 1}}},
        {$project: {
            '_id': 0,
            'count': 1
        }}
    ]
    ).exec()

    res.json(result[0].count)
})


module.exports = router