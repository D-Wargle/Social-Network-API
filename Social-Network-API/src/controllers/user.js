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

async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Delete user's thoughts
        await Thought.deleteMany({ name: user.name });

        // Delete user
        await user.deleteOne();

        res.json({ message: 'User deleted successfully!' });
    } catch (error) {
let status = error.statusCode || 500;
res.status(status).json({ message: 'User deletion failed!', error });
    }
    };

    async function getAllUsers(req, res) {
        try {
            const users = await User.find().populate('thoughts').populate('friends');
            res.json(users);
        } catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({ message: 'Error getting users', error });
        }
    }

    async function addFriend(req, res) {
        try {
            const { userId, friendId } = req.params;

            if (!isValidObjectId(userId) || !isValidObjectId(friendId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }

            if (userId === friendId) {
                return res.status(400).json({ error: 'Cannot add self as friend' });
            }

            const user = await User.findById(userId);
            const friend = await User.findById(friendId);

            if (!user || !friend) {
                return res.status(404).json({ error: 'User or friend not found' });
            }

            if (user.friends.includes(friendId)) {
                return res.status(400).json({ error: 'Friend already added' });
            }

            user.friends.push(friendId);
            await user.save();

            res.json({ message: 'Friend added successfully', user });
        } catch (error) {
            console.error('Error adding friend:', error);
            res.status(500).json({ message: 'Error adding friend', error });
        }
    }

    async function removeFriend(req, res) {
        try {
            const { userId, friendId } = req.params;

            if (!isValidObjectId(userId) || !isValidObjectId(friendId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }

            const user = await User.findById(userId);
            const friend = await User.findById(friendId);

            if (!user || !friend) {
                return res.status(404).json({ error: 'User or friend not found' });
            }

            if (!user.friends.includes(friendId)) {
                return res.status(400).json({ error: 'Friend not found' });
            }

            user.friends = user.friends.filter((f) => f.toString() !== friendId);
            await user.save();

            res.json({ message: 'Friend removed successfully', user });
        } catch (error) {
            console.error('Error removing friend:', error);
            res.status(500).json({ message: 'Error removing friend', error });
        }
    }

    async function getUserById(req, res) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }

            const user = await User.findById(id).populate('thoughts').populate('friends');

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
            } catch (error) {
                res.status(500).json({ message: 'Error getting user', error });
            }
        }

        module.exports = {
            createUser,
            updateUser,
            deleteUser,
            getAllUsers,
            addFriend,
            removeFriend,
            getUserById,
        }
    