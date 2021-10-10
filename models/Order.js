const mongoose = require('mongoose')

const Order = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    address: {
        type: Object,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    note: {
        type: String,
    },
    cart: { 
        type: Array,
        required: true,
    },
    confirm: { 
        type:Boolean,
        default: false,
    },
    payment: { 
        type:Boolean,
        default: false,
    },
    paymentDate: {
        type: String,
        default: '',
    },
    total: { 
        type: Number, 
        required:true
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", Order)
