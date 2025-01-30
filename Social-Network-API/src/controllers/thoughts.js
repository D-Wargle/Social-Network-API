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

//create new thought and add to user
async function createThought(req, res) {
    try {
        const thought = await Thought.create(req.body);
        //add thought reference to user
        await User.findByIdAndUpdate(req.body.userId, {
            $push: { thoughts: thought._id },
        });
        res.json(thought);
    } catch (error) {
        res.status(500).json(error);
    }
}

//delete thought and remove from user
async function deleteThought(req, res) {
    try {
        const { id } = req.params;
        const thought = await Thought.findByIdAndDelete(id);
        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No thought found with this id!' });
        }
        //remove thought reference from user
        await User.findByIdAndUpdate(thought.userId, {
            $pull: { thoughts: thought._id },
        });
        res.json({ message: 'Thought deleted successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
};

// add reaction to thought
async function addReaction(req, res) {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.id,
            { $push: { reactions: req.body } },
            { new: true }
        );
        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
    } catch (error) {
        res.status(500).json(error);
    }
};

// delete reaction from thought
async function deleteReaction(req, res) {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.id,
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );
        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
    } catch (error) {
        res.status(500).json(error);
    }
}

//update thought by id
async function updateThought(req, res) {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id)) {
			return res
				.status(400)
				.json({ message: 'Invalid thought ID format' });
		}

		const thought = await Thought.findByIdAndUpdate(id, req.body, {
			new: true,
		});

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
module.exports = {
    getThoughts,
    getThoughtById,
    createThought,
    deleteThought,
    addReaction,
    deleteReaction,
    updateThought,
};