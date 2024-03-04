const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcrypt')

const account = new Schema({
    username:{
        type: String,
        required : true,
    },
    password:{
        type: String,
        required : true,
    },
    name:{
        type: String,
    },
    changePasswordToken:{
        type: String,
    }
}, {
    timestamps: true
}
);

module.exports = mongoose.model('account', account)