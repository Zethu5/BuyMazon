const express = require('express')
const mongoose = require('mongoose');
const mongodb = require('mongodb')
const { emit } = require('process');
const { UserModel } = require('../Models/User')

const client = new mongodb.MongoClient('mongodb://localhost:27017/BuyMazon')
const db = client.db('BuyMazon')
mongoose.connect('mongodb://localhost:27017/BuyMazon');

let router = express.Router()

router
.route('/:id')
.get(async (req, res) => {
    const mapFunction = function() {if(this._id == id) this.products.forEach((product => {emit(product._id, 1)}))}
    const reduceFunction = function(key, values) {return Array.sum(values)}
    const result = await db.collection('users').mapReduce(
        mapFunction, 
        reduceFunction, 
        {
            out: {inline: 1},
            scope: {
                id: req.params.id
            }
        }
    )

    res.json(result)
})

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

module.exports = router