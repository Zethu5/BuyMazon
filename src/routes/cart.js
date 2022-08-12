const express = require('express')
const mongoose = require('mongoose');
const mongodb = require('mongodb')
const { emit } = require('process');
const { UserModel } = require('../Models/User');
const { arrayBuffer } = require('stream/consumers');

require('dotenv').config({path:__dirname + '../../.env'})

mongoose.connect(process.env.mongo_db_connection_uri);
const client = new mongodb.MongoClient(process.env.mongo_db_connection_uri)
const db = client.db('BuyMazon')


function findOneProductIndexInCart(array, element) {
    for(let i = 0; i < array.length; i++) {
        if(array[i]._id == element._id) return i
    }
    return -1
}

function findAndRemoveAllProductIndexesInCart(array, element) {
    for (var i = array.length -1; i >= 0; i--) {
        if(array[i]._id == element._id) array.splice(i, 1)
    }
}


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

router
.route('/:id/decreaseproduct')
.put(async (req, res) => {
    let user = await UserModel.findOne({_id: req.params.id}).exec()

    const product = req.body.product
    const index = findOneProductIndexInCart(user.products, product)

    if (index != -1) {
        user.products.splice(index, 1)
        await user.save()
        const socket = req.app.get('socket')
        socket.emit('userCartUpdate')
    }

    res.json({result: `Decreased ${product.name} from ${user.username}`})
})

router
.route('/:id/removeproduct')
.put(async (req, res) => {
    let user = await UserModel.findOne({_id: req.params.id}).exec()

    const product = req.body.product
    findAndRemoveAllProductIndexesInCart(user.products, product)
    await user.save()

    const socket = req.app.get('socket')
    socket.emit('userCartUpdate')
    res.json({result: `Removed ${product.name} from ${user.username}`})
})

router.route('/:id/clearcart')
.delete(async (req, res) => {
    let user = await UserModel.findOne({_id: req.params.id}).exec()
    user.products = []
    await user.save()

    const socket = req.app.get('socket')
    socket.emit('userCartUpdate')
    res.json({result: `Cleared the cart of ${user.username}`})
})

module.exports = router