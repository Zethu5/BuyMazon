/** @type {import("express").RequestHandler} */

const express = require('express')
const app = express()
const PORT = 3000

const products = require('./src/routes/products')
const manufacturers = require('./src/routes/manufacturers')


app.get('/', (req, res) => {
    // handle root
})


app.use('/products', products)
app.use('/manufacturers', manufacturers)


app.listen(PORT)