const router = require('express').Router();
const User = require("../models/user.js");
const RUser = require("../../Resident/models/residentUser.js");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var { nanoid } = require("nanoid");


dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);

router.post('/getaddress', async (req, res) => {

    const user = await User.findOne({ email: req.body.email });
    res.send(user.address);
})

router.post('/getstores', async (req, res) => {

    const user = await User.findOne({ id: req.body.id });
    console.log(user.stores)
    res.send(user.stores);
})

router.post('/addstore', async (req, res) => {
    const { bname, grossRebatePercentage, address, ID } = req.body;
    console.log(req.body)

    try {
        // Find the main user by their ID
        const mainUser = await User.findOne({id: ID});

        if (!mainUser) {
            console.log(mainUser)
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new store object with the provided data
        const newStore = {
            bname: bname,
            grossRebatePercentage: grossRebatePercentage,
            address: address,
            storeID: nanoid(),
            status: true,
            // Other fields are left blank by default
        };

        // Add the new store to the stores array of the main user
        mainUser.stores.push(newStore);

        // Save the updated main user
        await mainUser.save();

        res.status(201).json({ message: 'Store added successfully', store: newStore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.post('/register', async (req, res) => {
    console.log(req.body);

    const account = await stripe.accounts.create({
        country: 'US',
        type: 'express',
        capabilities: {
          card_payments: {
            requested: true,
          },
          transfers: {
            requested: true,
          },
        },
        business_type: 'individual',
        business_profile: {
         // url: req.body.website,
        },
        email: req.body.email,
        individual: {
            phone: req.body.phoneNumber,
            first_name: req.body.fname,
            last_name: req.body.lname,
            address: {
                line1: req.body.address
            },
        }
      });

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'http://localhost:3000/signup',
        return_url: 'http://localhost:3000/signin?reg=true',
        type: 'account_onboarding',
      });
      console.log(accountLink)
    
    const user = new User({
        email: req.body.email,
        fname: req.body.fname,
        lname: req.body.lname,
        password: req.body.password,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        id: new mongoose.Types.ObjectId(),
        signupDate: Date.now(),
        stores: req.body.stores,
        program: req.body.program,
        contributionLimit: 1000,
        eventParticipation: true,
        website: req.body.website,
        accountHolderType: 'individual',
        accountHolderName: req.body.fname + " " + req.body.lname,
        stripeAccountId: account.id

    })
    try {
        const savedUser = await user.save();
        
        const final = {
            savedUser,
            accountLink
        }
        savedUser.accountLink = accountLink;
        console.log(final)
        res.send(final);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;