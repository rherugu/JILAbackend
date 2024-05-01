const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

// Connect to DB
mongoose 
 .connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log("ERROR", err));


//Import routes
const merchantReg = require('./Merchant/routes/auth.js');
const residentReg = require('./Resident/routes/authR.js');

//Route middlewares
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000/"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use('/api/merchant/', merchantReg);
app.use('/api/resident/', residentReg);

app.listen(4000, () => console.log('Server up and running'));

