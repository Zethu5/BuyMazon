const express = require('express')
const mongoose = require('mongoose')
const { OrderModel } = require('../Models/Order')

require('dotenv').config({path:__dirname + '../../.env'})

mongoose.connect(process.env.mongo_db_connection_uri);
let router = express.Router()


router
.route('/')
.get(async (req, res) => {
    res.json(await OrderModel.find().exec())
})
.post(async (req, res) => {
    const order = new OrderModel(req.body)
    await order.save()
    const socket = req.app.get('socket')
    socket.emit('newOrder')
    res.json({order_id: order._id})
})


module.exports = router