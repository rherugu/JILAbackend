const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    shopname: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amountSaved: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("transactionmodel", transactionSchema);
