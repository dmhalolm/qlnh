const mongoose = require('mongoose')
const { Schema } = mongoose

const warehouse = new Schema({
    name:{
        type: String,

    },
    number:{
        type: Number,

    },
    donvi:{
        type: String,

    },
    warningnum:{
        type: Number,

    },
    tbgia:{
        type: Number,
    },
    totalimport:{
        type: Number,
    }
},{
    timestamps: true
}
);

module.exports = mongoose.model('warehouse', warehouse)