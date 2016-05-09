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
    Code.find({})
        .then((code) => res.json(code))
    .catch(next);
});

// router.get('/eval', function(req,res,next) {
//     //console.log('192.168.1.194:3000/exec_js?user_script=' + req.query.user_script.toString())
//     request.get('http://192.168.1.194:3000/exec_js?user_script=' + req.query.user_script, function(err, response) {
//        res.send(response.body)
//    });
// });

// get all revisions from one code document
router.get('/:codeId', function(req,res,next) {
    Code.findById(req.params.codeId)
        .then((code) => {
            res.json(code.revisions);
        })
    .catch(next);
});

router.post('/', Auth.assertAuthenticated, function(req, res, next) {
    Code.create(req.body) // Body must include code, author.
        .then(code => res.send(code))
    .then(null, next);
});

router.put('/:codeId', function(req, res, next) {
    Code.findById(req.params.codeId)
        .then(code => {
            code.revisions.push(req.body.revisedCode); 
            // be sure to include 'revisedCode' in the $http request body
            return code.save();
        })
    .then(updatedCode => res.json(updatedCode))
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


