const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcrypt')

const order = new Schema({
    name:{
        type: String,
    },
    tables: {
        type: Schema.Types.ObjectId,
    },
    tableNames: {
        type: String,
    },
    dishes: [{
        dishId: {
            type: Schema.Types.ObjectId,
            ref: 'Nguyenlieu',
            required: true
        },
        nameDish:{
            type: String,
        },
        priceDish:{
            type: Number,
        },

        quantityDish: {
            type: Number,
            required: true
        }
    }],
    profit: {
        type: Number,
        default: 0
    },

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

module.exports = mongoose.model('order', order)