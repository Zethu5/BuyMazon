const express = require('express')
const mongoose = require('mongoose')
const { CMSModel } = require('../Models/Cms')

require('dotenv').config({path:__dirname + '../../.env'})

mongoose.connect(process.env.mongo_db_connection_uri);
let router = express.Router()


router
.route('/')
.get(async (req, res) => {
    res.json(await CMSModel.find().exec())
})
.post(async (req, res) => {
    const cms = new CMSModel(req.body)
    await cms.save()
    res.json({cms_id: cms._id})
})

router
.route('/:id')
.get(async (req, res) => {
    res.json(await CMSModel.findById(req.params.id).exec())
})
.put(async (req, res) => {
    await CMSModel.findOneAndUpdate({_id: req.params.id}, req.body)
    res.json({result: 'Updated CMS data'})
})

module.exports = router