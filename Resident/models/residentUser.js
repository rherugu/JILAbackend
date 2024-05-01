const mongoose = require('mongoose');


const residentSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    signupDate: {
        type: String,
        required: true,
    },
    agreeToRecieveTexts: {
        type: Boolean,
        required: true,
        default: false,
    },
    block: {
        type: String,
        required: true,
    },
    lot: {
        type: String,
        required: true,
    },
    program: {
        type: String,
        required: true,
    },
    rebateTotal: {
        type: Number,
        required: true,
        default: 0,
    },
    zipCode: {
        type: Number,
        required: true,
    },
    numberOfTransactions: {
        type: Number,
        required: true,
        default: 0,
    },
    taxReductionTotal: {
        type: Number,
        required: true,
        default: 0,
    },
    transactions: {
        type: Array,
        required: false,
        default: [],
    }
})

module.exports = mongoose.model("residentmodel", residentSchema);
