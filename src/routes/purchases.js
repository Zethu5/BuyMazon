const express = require('express')
const mongoose = require('mongoose')
const { PurchaseModel } = require('../Models/Purchase')

require('dotenv').config({path:__dirname + '../../.env'})

mongoose.connect(process.env.mongo_db_connection_uri);
let router = express.Router()


router
.route('/')
.get(async (req, res) => {
    res.json(await PurchaseModel.find().exec())
})
.post(async (req, res) => {
    const purchase = new PurchaseModel(req.body)
    await purchase.save()
    const socket = req.app.get('socket')
    socket.emit('newPurchase')
    res.json({result: 'Added purchase ' + purchase._id})
})


module.exports = router