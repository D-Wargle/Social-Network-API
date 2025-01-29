// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const api = require('./routes/api');

// Initialize Express app
const app = express();

// enable cors
app.use(cors());

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//mount the api
app.use ('/api', api);

//root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Social Network');
});

// start server
app.listen(3000, () => {
    console.log('Server has started');
});

//connect to mongodb
mongoose

    .connect('mongodb://127.0.0.1:27017/social_network')
	.then(() => console.log('Connected to MongoDB!'))
	.catch((err) => console.error('MongoDB connection error:', err));
