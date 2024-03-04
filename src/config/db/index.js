const mongoose = require('mongoose')

async function connect() {

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test');
        console.log('Connected successfully')
    } catch (err) {
        console.log('Connected Failed')
    }
}

module.exports = { connect }