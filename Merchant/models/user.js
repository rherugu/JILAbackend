const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  bname: {
    type: String,
    required: true,
  },
  storeSignupDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  grossRebatePercentage: {
    type: Number,
    required: true,
  },
  numberOfComplaints: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: Boolean,
    required: true,
  },
  employeeIDs: {
    type: Array,
    required: false,
  },
  storeID: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  }
});

const merchantSchema = new mongoose.Schema({
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
  stores: [storeSchema],
  signupDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  program: {
    type: String,
    required: true,
  },
  accountHolderName: {
    type: String,
    required: false,
  },
  accountHolderType: {
    type: String,
    required: false,
  },
  
  stripeAccountId: {
    type: String,
    required: false,
  },

  contributionLimit: {
    type: Number,
    required: false,
    default: 1000,
  },
  eventParticipation: {
    type: Boolean,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Merchant", merchantSchema);
