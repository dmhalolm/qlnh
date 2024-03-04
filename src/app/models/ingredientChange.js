const mongoose = require('mongoose')
const { Schema } = mongoose

const ingredientchange = new Schema({

    Ids: [],
    nameIns: [],
    donviIns: [],
    priceIns: [],
    quantityIns: [],
    priceTo: [],
    totalPrice: {
        type: Number,
        default: 0
    },
    status:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
}
);

module.exports = mongoose.model('ingredientchange', ingredientchange)