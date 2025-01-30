const express = require('express');
const { body } = require('express-validator');
const {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById,
    addFriend,
    removeFriend,
} = require('../controllers/user');

const router = express.Router();

//POST /api/users
router.post(
    '/',
    [
        body('username')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Please enter your username.'),
    body('email').isEmail().withMessage('Please enter a valid email.'),
    ],
    createUser
);

//PUT /api/users/:id
router.put(
    '/:id',
    [
        body('username')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Please enter your username.'),
    ],
    updateUser
);

//GET /api/users/all
router.get('/all', getAllUsers);

//GET /api/users/:id
router.get('/:id', getUserById);

//DELETE /api/users/:id
router.delete('/:id', deleteUser);

//Friend routes
router.route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend);

    module.exports = router;
