const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { UserModel } = require('../Models/User')

let router = express.Router()
mongoose.connect('mongodb://localhost:27017/BuyMazon');

router
.route('/')
.get(async (req, res) => {
    res.json(await UserModel.find().exec())
})
.post(async (req, res) => {
    // random salt
    const salt = await bcrypt.genSalt(10)

    // generate unique password each time
    const hashed_password = await bcrypt.hash(req.body.password, salt)

    // create user and replace his password with the hashed and salted password
    let user = new UserModel(req.body)
    user.password = hashed_password

    // save to db
    await user.save()
    res.json({result: `created user ${user.username}`})
})

router
.route('/:id')
.get(async (req, res) => {
    res.json(await UserModel.find({id: req.params.id}).exec())
})
.put(async (req, res) => {
    let updated_user = req.body

    if (req.params.password) {
        // random salt
        const salt = await bcrypt.genSalt(10)

        // generate unique password each time
        const hashed_password = await bcrypt.hash(req.body.password, salt)

        // create user and replace his password with the hashed and salted password
        let updated_user = req.body
        updated_user.password = hashed_password
    }

    await UserModel.findOneAndUpdate({_id: req.params.id}, updated_user)
    res.json({result: 'Updated user ' + req.params.username})
})
.delete(async (req, res) => {
    await ManufacturerModel.findOneAndDelete({_id: req.params.id})
    res.json({result: 'Deleted user ' + req.params.username})
})

router
.route('/username/:username')
.get(async (req, res) => {
    res.json(await UserModel.findOne({username: req.params.username}).exec())
})

router
.route('/login')
.post(async (req, res) => {
    const user = await UserModel.findOne({username: req.body.username}).exec()

    if (user === null) {
        return res.status(403).json({error: 'Username or password are incorrect'})
    }

    if (!bcrypt.compare(req.body.password, user.password)) {
        return res.status(403).json({error: 'Username or password are incorrect'})
    }

    res.status(200).json({
        username: user.username,
        isAdmin: user.isAdmin
    })
    const socket = req.app.get('socket')
    socket.emit('loggedIn', user.username)
    socket.emit('userCartUpdate')
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