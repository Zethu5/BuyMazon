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

module.exports = router