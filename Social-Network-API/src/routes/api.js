const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const thoughtRoutes = require('./thoughts');

router.use('/users', userRoutes);

router.use('/thoughts', thoughtRoutes);
module.exports = router;