'use strict';

const Auth = require('../../../utils/auth.middleware');
const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.param('userId', function(req, res, next, userId) {
    User.findById(userId)
        .then(function(user) {
            if (!user) {
                let err = new Error('User not found');
                err.status = 404;
                throw err;
            }
            req.requestedUser = user;
            next();
        })
        .catch(next);
});

router.get('/', Auth.assertAdmin, function(req,res,next) {
    User.find({})
        .then((users) => res.json(users))
    .catch(next);
});

router.get('/:userId', Auth.assertAdminOrSelf, function(req, res) {
    res.json(req.requestedUser);
});

router.post('/', function(req,res,next) {
    User.create(req.body)
        .then((user) => res.json(user))
    .catch(next);
});

router.delete('/:userId', Auth.assertAdmin, function(req,res,next) {
    User.findByIdAndRemove(req.params.userId)
        .then(() => res.status(204).end())
    .catch(next);
});

router.put('/:userId', Auth.assertAdminOrSelf, function(req,res,next) {
    User.findById(req.params.userId)
        .then(function(user) {
            user.set(req.body);
            return user.save();
        })
        .then((user) => res.status(204).json(user))
    .catch(next);
});

module.exports = router;
