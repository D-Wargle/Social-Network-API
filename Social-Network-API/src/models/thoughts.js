const mongoose = require('mongoose');
const Schema = mondgoose.Schema;

//reaction schema
const reactionSchema = new Schema(
    {
        //unique identifier
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
        },
        //reaction contents
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        //user of the reaction
        name: {
            type: String,
            required: true,
        },
        //timestamp
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => dateFormat(timestamp),
        },
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);


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

//helper for timestamps
function dateFormat(timestamp) {
    return new Date(timestamp).toLocaleString();
};

//virtual for reaction count
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = mongoose.model('Thought', ThoughtSchema);
module.exports = Thought;