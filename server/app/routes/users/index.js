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
    User.find({}).select('-salt')
        .then((users) => res.json(users))
    .catch(next);
});

router.get('/:userId', Auth.assertAdminOrSelf, function(req, res) {
    res.json(req.requestedUser.sanitize());
});

router.post('/', function(req,res,next) {
    User.create(req.body)
        .then((user) => res.json(user.sanitize()))
    .catch(next);
});

router.delete('/:userId', Auth.assertAdmin, function(req,res,next) {
    User.findByIdAndRemove(req.params.userId)
        .then(() => res.status(204).end())
    .catch(next);
});

router.put('/:userId', Auth.assertAdminOrSelf, function(req,res,next) {
    delete req.body.__v;
    Object.keys(req.body).forEach(k => req.requestedUser[k] = req.body[k]);
    req.requestedUser.save()
    .then((user) => {
        res.status(201).json(user.sanitize());
    })
    .catch(next);
});

router.put('/:userId/updatePassword', Auth.assertAdminOrSelf, function(req,res,next) {
    console.log(req.requestedUser.correctPassword(req.body.oldPassword))
    if (!req.requestedUser.correctPassword(req.body.oldPassword)) {
        let err = new Error('There was an error updating your password');
        err.status = 401;
        return next(err);
    } else if (req.requestedUser.correctPassword(req.body.oldPassword)) {
        req.requestedUser.password = req.body.newPassword;
        req.requestedUser.save()
        .then((user) => {
            res.status(201).json(user.sanitize());
        })
        .catch(next);
    }
});

router.put('/:userId/disconnectProvider', Auth.assertAdminOrSelf, function (req, res, next) {
    req.requestedUser[req.body.provider] = undefined;
    req.requestedUser.save()
    .then(user => res.status(201).json(user.sanitize()))
    .catch(next);
})

module.exports = router;
