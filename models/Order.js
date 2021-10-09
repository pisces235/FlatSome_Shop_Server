const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

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

// Add plugins
Order.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

module.exports = mongoose.model("Order", Order)
