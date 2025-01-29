const User = require('../models/user');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Thought = require('../models/thought');

// Helper function to validate MongoDB ObjectIds
function isValidObjectId(id) {
	return mongoose.Types.ObjectId.isValid(id);
}

// Create a new user
async function createUser(req, res) {
    try {
        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessage = new Error('Validation failed');
            errorMessage.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
  
        const { name, email } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'Email already exists' });
        }
     const newUser = await User.findOne({ name });
        if (newUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        await User.create({ name, email });
        res.json({ message: 'User created successfully' });
    } catch (error) {
		let status = 500;

		if (error.statusCode) {
			status = error.statusCode;
		}
		console.error('Error registering user:', error);
		res.status(status).json({ message: 'Registration failed!', error });
    }
};

async function updateUser(req, res) {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessage = new Error('Validation failed');
            errorMessage.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const { name } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const newUser = await User.findOne({
            name: { $regex: new RegExp(name, 'i') },
            _id : { $ne: req.params.id },
        });

        if (newUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        user.name = name;
		await user.save();

		res.json({ message: 'User updated successfully!' });
	} catch (error) {
		let status = 500;

		if (error.statusCode) {
			status = error.statusCode;
		}
		console.error('Error registering user:', error);
		res.status(status).json({ message: 'User update failed!', error });
    }
} 