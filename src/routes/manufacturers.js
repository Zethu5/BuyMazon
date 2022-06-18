const express = require('express')
const mongoose = require('mongoose')
const { Manufacturer } = require('../Models/Manufacturer')

let router = express.Router()
mongoose.connect('mongodb://localhost:27017/BuyMazon');

router
.route('/')
.get(async (req, res) => {
    res.sendStatus(200).json(await Manufacturer.find().exec())
})
.post(async (req, res) => {
    const manufacturer = new Manufacturer(req.body.manufacturer)
    await Manufacturer.save(manufacturer)
    res.sendStatus(200).send('Added manufacturer ' + req.body.manufacturer.id)
})

router
.route('/:id')
.get(async (req, res) => {
    res.sendStatus(200).json(await Manufacturer.find({id: req.params.id}).exec())
})
.put(async (req, res) => {
    await Manufacturer.findOneAndUpdate({id: req.params.id}, req.body.manufacturer)
    res.sendStatus(200).send('Updated manufacturer ' + req.params.id)
})
.delete(async (req, res) => {
    await Manufacturer.findOneAndDelete({id: req.params.id})
    res.sendStatus(200).send('Deleted manufacturer ' + req.params.id)
})


module.exports = router