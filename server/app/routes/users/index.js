'use strict';

const Auth = require('../../../utils/auth.middleware');
const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Code = mongoose.model('Code');

router.route('/')
.get(Auth.assertAdmin, function (req,res,next) {
    User.find({}).select('-salt')
    .then(users => res.json(users))
    .catch(next)
})
.post(function (req,res,next) {
    User.create(req.body)
    .then(user => res.json(user.sanitize()))
    .catch(next);
});

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

router.route('/:userId')
.get(Auth.assertAdminOrSelf, function (req,res,next) {
    res.json(req.requestedUser.sanitize());
})
.put(Auth.assertAdminOrSelf, function (req,res,next) {   
    let query;
    if (req.body.password && !req.requestedUser.correctPassword(req.body.oldPassword)) {
        let err = new Error('Unable to update your password. Please try again.');
        err.status = 401;
        return next(err);
    } else if (req.body.provider) {
        let unset = {$unset: {}};
        unset.$unset[req.body.provider] = 1;
        query = User.findByIdAndUpdate(req.requestedUser._id, unset, {new: true, runValidators: true});
    } else {
        req.requestedUser.set(req.body);
        query = req.requestedUser.save();
    }
    query.then(user => res.status(201).json(user.sanitize()))
    .catch(next);
})
.delete(Auth.assertAdminOrSelf, function (req,res,next) {
    User.findByIdAndRemove(req.params.userId)
    .then(() => res.status(204).end())
    .catch(next);
})

router.get('/:userId/code', Auth.assertAdminOrSelf, function(req, res, next) {
    Code.find({
        author: req.requestedUser._id})
    .then(code => res.json(code))
    .catch(next);
});

module.exports = router;
