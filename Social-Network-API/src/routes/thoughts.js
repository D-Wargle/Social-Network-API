const express = require('express');
const router = express.Router();
const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction,
} = require('../controllers/thoughts');

// /api/thoughts
router.route('/').get(getAllThoughts).post(createThought);

// /api/thoughts/:id
router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);

    // /api/thoughts/:thoughtId/reactions
    router.route('/:thoughtId/reactions').post(addReaction);

    // /api/thoughts/:thoughtId/reactions/:reactionId
    router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);
    
    module.exports = router;