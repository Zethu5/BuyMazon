const express = require('express')
const mongoose = require('mongoose')
const { AdModel } = require('../Models/Ad')

require('dotenv').config({path:__dirname + '../../.env'})

mongoose.connect(process.env.mongo_db_connection_uri);
let router = express.Router()


router
.route('/')
.get(async (req, res) => {
    res.json(await AdModel.find().exec())
})
.post(async (req, res) => {
    const ad = new AdModel(req.body)
    await ad.save()
    const socket = req.app.get('socket')
    socket.emit('adUpdate', ad)
    res.json({ad_id: ad._id})
})

router
.route('/:id')
.get(async (req, res) => {
    res.json(await AdModel.findById(req.params.id).exec())
})
.put(async (req, res) => {
    await AdModel.findOneAndUpdate({_id: req.params.id}, req.body)
    const socket = req.app.get('socket')
    socket.emit('adUpdate')
    res.json({result: 'Updated ad ' + req.params.id})
})
.delete(async (req, res) => {
    await AdModel.findOneAndDelete({_id: req.params.id})
    const socket = req.app.get('socket')
    socket.emit('adUpdate')
    res.json({result: 'Deleted ad ' + req.params.id})
})

module.exports = router