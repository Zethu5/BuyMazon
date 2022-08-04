/** @type {import("express").RequestHandler} */

const express = require('express')
const app = express()
const PORT = 3000
const cors = require('cors');
const bodyParser = require('body-parser');

const products = require('./src/routes/products')
const manufacturers = require('./src/routes/manufacturers')
const branches = require('./src/routes/branches')


app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(bodyParser.json());

// handle root
app.get('/', (req, res) => {})


app.use('/api/products', products)
app.use('/api/manufacturers', manufacturers)
app.use('/api/branches', branches)

// socket config
const socket = require('socket.io')(3210, {
    cors: {
        origin: '*',
    }
})

// transfer socket to routes
app.set('socket', socket)


app.listen(PORT)