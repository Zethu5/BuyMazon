const express = require('express')
const mongoose = require('mongoose');
const mongodb = require('mongodb')
const { emit } = require('process');
const { UserModel } = require('../Models/User')

require('dotenv').config({path:__dirname + '../../.env'})

mongoose.connect(process.env.mongo_db_connection_uri);
const client = new mongodb.MongoClient(process.env.mongo_db_connection_uri)
const db = client.db('BuyMazon')

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