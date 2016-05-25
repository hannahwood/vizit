'use strict';

const router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
const Code = mongoose.model('Code');

router.route('/')
.get(function(req,res,next) {
    Code.find(req.query)
    .then((code) => res.json(code))
    .catch(next);
})
.post((req, res, next) => {
    Code.create(req.body)
    .then(code => res.send(code))
    .catch(next);
});

router.param('codeId', function (req,res,next,codeId) {
    Code.findById(codeId)
    .then((code) => {
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

router.route('/:codeId')
.get((req,res,next) => res.json(req.code))
.put((req, res, next) => {
    if (req.body.revision) req.code.revisions.push(req.body.revision);
    else if (req.body.title || req.body.tags) req.code.set(req.body);
    req.code.save()
    .then(updatedCode => res.status(201).json(updatedCode))
    .catch(next);
})
.delete((req, res, next) => {
    Code.findByIdAndRemove(req.code._id)
    .then(() => res.status(204).send())
    .catch(next);
});

router.delete('/:codeId/:revisionIndex', (req, res, next) => {
    var index = parseInt(req.params.revisionIndex);
    req.code.revisions.splice(index, 1);
    req.code.save()
    .then(updatedCode => res.json(updatedCode))
    .catch(next);
});


