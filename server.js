/** @type {import("express").RequestHandler} */

const express = require('express')
const app = express()
const PORT = 3000
const cors = require('cors');
const bodyParser = require('body-parser');

const products = require('./src/routes/products')
const manufacturers = require('./src/routes/manufacturers')


app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    // handle root
})


app.use('/api/products', products)
app.use('/api/manufacturers', manufacturers)


app.listen(PORT)