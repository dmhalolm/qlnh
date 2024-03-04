const mongoose = require('mongoose')
const { Schema } = mongoose

const tableSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    orderId: {
        type: Schema.Types.ObjectId,
    },
    status: {
        type: Boolean,
        required: true,
        default: true 
    },
})

module.exports = mongoose.model('Table', tableSchema)