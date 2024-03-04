const mongoose = require('mongoose')
const { Schema } = mongoose

const menu = new Schema({
    name:{
        type: String,

    },
    price:{
        type: Number,

    },
    ingredients: [{
        ingredientsId: {
            type: Schema.Types.ObjectId,
            ref: 'Nguyenlieu',
            required: true
        },
        nameIn:{
            type: String,
        },
        donviIn:{
            type: String,
        },

        quantity: {
            type: Number,
            required: true
        }
    }],
    img:{
        type: String,
    }
});

module.exports = mongoose.model('menu', menu)