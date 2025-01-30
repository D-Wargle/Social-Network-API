const mongoose = require('mongoose');
const Schema = mondgoose.Schema;

// Thought Schema
const ThoughtSchema = new Schema(
    {
        //thought contents
        thoughtText: {
            type: String,
            required: 'Please enter your thought',
            minlength: 1,
            maxlength: 300,
        },
        //timestamp
        createAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => dateFormat(timestamp),
        },
        //user of the thought
        name: {
            type: String,
            required: true,
        },
        //reactions
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);