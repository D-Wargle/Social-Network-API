const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Define the User schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Please enter a valid email address',
            ],
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thought',
    },
],
friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
},
],
},
{
    toJSON: {
        virtuals: true,
    },
    id: false,
    }
);
