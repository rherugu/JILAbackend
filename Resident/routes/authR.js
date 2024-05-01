const router = require('express').Router();
const User = require("../models/residentUser.js");
const Muser = require("../../Merchant/models/user.js");
const mongoose = require('mongoose');
const { LoginValidation } = require("../validation.js");
const jwt = require("jsonwebtoken");
const { valid } = require('joi');
const dotenv = require('dotenv');
const Transaction = require('../models/transaction.js');
const { unsubscribe } = require('./authR.js');

const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);
dotenv.config();

router.post('/register/ce', async (req, res) => {
    console.log(req.body.email)
    const emailExist = await User.findOne({ email: req.body.email }).exec();
    const emailExist1 = await Muser.findOne({ email: req.body.email }).exec();
    console.log(emailExist); 
    console.log(emailExist1);
    if (emailExist || emailExist1) {
        return res.status(200).json({stat: 0});
    } else {
        return res.status(200).json({stat: 1});
    }
})


router.post('/register', async (req, res) => {
    console.log(req.body);
    
    const user = new User({
        email: req.body.email,
        fname: req.body.fname,
        lname: req.body.lname,
        password: req.body.password,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        id: new mongoose.Types.ObjectId(),
        signupDate: Date.now(),
        agreeToRecieveTexts: req.body.agreeToRecieveTexts,
        block: req.body.block,
        lot: req.body.lot,
        program: req.body.program,
        rebateTotal: req.body.rebateTotal,
        zipCode: req.body.zipCode
    })
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    const user = await User.find({id: req.body.id}).exec();

    res.send(user);
})

router.post('/', async (req, res) => {
    const { error } = LoginValidation(req.body);
    if (error) return res.status(404).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user || user == "null" || user == null || user == "" || user == NaN){
            const muser = await Muser.findOne({ email: req.body.email });
            console.log(muser)
            if (!muser || muser == null || muser == "" || muser == NaN)
                return res.status(404).send("Email or password is invalid.");
            else {
                const { email, password, fname, lname, stripeAccountId, address, __id } = muser;
                const validPass = (req.body.password == password);
                console.log(validPass)
                if (!validPass)
                    return res.status(404).send("Email or password is invalid.");

                const token1 = jwt.sign({ _id: muser._id }, process.env.TOKEN_SECRET);

                const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
                console.log(loginLink);
                const packet1 = {
                    token: token1,
                    ...muser._doc,
                    type: 1,
                    loginLink: loginLink,
                    address: address,
                    ___id: __id
                }
                res.header("auth-token", token1).send(packet1);
            }
        }
        else {
            
            const { email, password, fname, lname } = user;
            const validPass = (req.body.password == password);
            console.log(validPass)
            if (!validPass)
                return res.status(404).send("Email or password is invalid.");

            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
            const packet = {
                token: token,
                ...user._doc,
                type: 0,
            }
            res.header("auth-token", token).send(packet);
        }
   
})

router.post('/addtransactions', async(req, res) => {
    const { transactions, _id } = req.body;

    try {
      // Find the shop by name
      const user = await User.findOne({ _id: _id });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!Array.isArray(user.transactions)) {
        user.transactions = [];
      }

      // Add the transaction to the shop's transactions array
      transactions.forEach(async (transaction) => {
        const { shopname, date, amountSaved, amountPaid } = transaction;

        // Add the transaction to the user's transactions array
        user.transactions.push({
            shopname,
            date,
            amountSaved,
            amountPaid
        });
    });

  
      // Save the updated shop
      await user.save();
  
      return res.status(200).json({ message: 'Transaction added successfully' });
    } catch (error) {
      console.error('Error adding transaction:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/transactions/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        // Find the user by id
        const user = await User.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the transactions associated with the user
        res.json({ transactions: user.transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})




module.exports = router;