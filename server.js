/** @type {import("express").RequestHandler} */

const express = require('express')
const app = express()
const PORT = 3000
const cors = require('cors');
const bodyParser = require('body-parser');

const products = require('./src/routes/products')
const manufacturers = require('./src/routes/manufacturers')
const branches = require('./src/routes/branches')
const users = require('./src/routes/users')
const cart = require('./src/routes/cart')
const orders = require('./src/routes/orders')
const ads = require('./src/routes/ads')
const cms = require('./src/routes/cms')


app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(bodyParser.json());

// handle root
app.get('/', (req, res) => {})


app.use('/api/products', products)
app.use('/api/manufacturers', manufacturers)
app.use('/api/branches', branches)
app.use('/api/users', users)
app.use('/api/cart', cart)
app.use('/api/orders', orders)
app.use('/api/ads', ads)
app.use('/api/cms', cms)

// socket config
const socket = require('socket.io')(3210, {
    cors: {
        origin: '*',
    }
})

// transfer socket to routes
app.set('socket', socket)


app.listen(PORT)