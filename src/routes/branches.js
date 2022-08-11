const express = require('express')
const mongoose = require('mongoose')
const { BranchesModel } = require('../Models/Branch')

require('dotenv').config({path:__dirname + '../../.env'})

mongoose.connect(process.env.mongo_db_connection_uri);
let router = express.Router()

router
.route('/')
.get(async (req, res) => {
    res.json(await BranchesModel.find().exec())
})
.post(async (req, res) => {
    const branch = new BranchesModel(req.body)
    await branch.save()
    const socket = req.app.get('socket')
    socket.emit('branchUpdate')
    res.json({result: 'Added branch ' + branch._id})
})

router
.route('/:id')
.get(async (req, res) => {
    res.json(await BranchesModel.find({id: req.params.id}).exec())
})
.put(async (req, res) => {
    await BranchesModel.findOneAndUpdate({_id: req.params.id}, req.body)
    const socket = req.app.get('socket')
    socket.emit('branchUpdate')
    res.json({result: 'Updated branch ' + req.params.id})
})
.delete(async (req, res) => {
    await BranchesModel.findOneAndDelete({_id: req.params.id})
    const socket = req.app.get('socket')
    socket.emit('branchUpdate')
    res.json({result: 'Deleted branch ' + req.params.id})
})


module.exports = router