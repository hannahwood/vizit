'use strict';

const router = require('express').Router();
const request = require('request');
module.exports = router;
const mongoose = require('mongoose');
const Code = mongoose.model('Code');
const User = mongoose.model('User');
const Auth = require('../../../utils/auth.middleware');

// get all for testing purposes
router.get('/', function(req,res,next) {
    Code.find(req.query)
        .then((code) => res.json(code))
    .catch(next);
});

// get all revisions from one code document
router.get('/:codeId', function(req,res,next) {
    Code.findById(req.params.codeId)
        .then((code) => {
            res.json(code);
        })
    .catch(next);
});

router.post('/', Auth.assertAuthenticated, function(req, res, next) {
    console.log(req.body);
    Code.create(req.body) // Body must include code, author.
        .then(code => res.send(code))
    .then(null, next);
});

router.param('codeId', function (req,res,next,codeId) {
    Code.findById(codeId)
    .then(function (code) {
        if (!code) {
            let err = new Error('Code not found');
            err.status = 404;
            throw err;
        }
        req.code = code;
        next();
    })
    .catch(next);
})

router.put('/:codeId', function(req, res, next) {
    if (req.body.revision) req.code.revisions.push(req.body.revision);
    else if (req.body.title || req.body.tags) req.code.set(req.body);
    req.code.save()
    .then(updatedCode => res.status(201).json(updatedCode))
    .then(null, next);
});

// remove entire code document
router.delete('/:codeId', Auth.assertAdminOrSelf, function(req, res, next) {
    Code.remove({_id: req.params.codeId})
        .then(() => res.status(204).send())
    .then(null, next);
});

// remove one revision
router.delete('/:codeId/:revisionIndex', Auth.assertAdminOrSelf, function(req, res, next) {
    Code.findById(req.params.codeId)
        .then(code => {
            var index = parseInt(req.params.revisionIndex);
            code.revisions.splice(index, 1);
            // be sure to include 'revisedCode' in the $http request body
            return code.save();
        })
    .then(updatedCode => res.json(updatedCode))
    .then(null, next);
});


