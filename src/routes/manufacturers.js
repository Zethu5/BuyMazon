const express = require('express')
const mongoose = require('mongoose')
const { ManufacturerModel } = require('../Models/Manufacturer')

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
    res.json({'created object': manufacturer._id})
})

router
.route('/:id')
.get(async (req, res) => {
    res.json(await ManufacturerModel.find({id: req.params.id}).exec())
})
.put(async (req, res) => {
    await ManufacturerModel.findOneAndUpdate({id: req.params.id}, req.body.manufacturer)
    res.json({result: 'Updated manufacturer ' + req.params.id})
})
.delete(async (req, res) => {
    await ManufacturerModel.findOneAndDelete({_id: req.params.id})
    res.json({result: 'Deleted manufacturer ' + req.params.id})
})


module.exports = router