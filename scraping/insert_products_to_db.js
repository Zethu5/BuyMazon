const fs = require('fs')
const mongoose = require('mongoose');
const { exit } = require('process');
const { ManufacturerModel } = require('../src/Models/Manufacturer')
const { ProductModel } = require('../src/Models/Product')
mongoose.connect('mongodb://localhost:27017/BuyMazon');


function run_scraper() {
    const spawnSync = require("child_process").spawnSync;
    spawnSync('python', ["ampm_scraper.py"]);
}

async function get_manufacturers() {
    return await ManufacturerModel.find().exec()
}


async function main(scrape) {
    if(scrape) run_scraper()
    let rawData = fs.readFileSync('data.json')
    let products = JSON.parse(rawData)

    let manufacturers = await get_manufacturers()

    products.forEach((productJson) => {
        productJson.manufacturer = manufacturers[Math.floor(Math.random()*manufacturers.length)]     
    });

    await ProductModel.insertMany(products)
}

main(scrape=false).then(() => {exit(0)})