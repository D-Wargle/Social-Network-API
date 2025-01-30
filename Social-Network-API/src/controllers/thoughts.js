const Thought = require('../models/thoughts');
const User = require('../models/user');
const mongoose = require('mongoose');

//validate mongoDB object ID
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

//get thoughts
async function getThoughts(req, res) {
    try {
		const thoughts = await Thought.find();
		res.json(thoughts);
	} catch (err) {
		res.status(500).json(err);
	}
};

//get thought by id
async function getThoughtById(req, res) {
    try {
		const { id } = req.params;
		if (!isValidObjectId(id)) {
			return res
				.status(400)
				.json({ message: 'Invalid thought ID format' });
		}

		const thought = await Thought.findById(id);
		if (!thought) {
			return res
				.status(404)
				.json({ message: 'No thought found with this id!' });
		}
		res.json(thought);
	} catch (err) {
		res.status(500).json(err);
	}
};