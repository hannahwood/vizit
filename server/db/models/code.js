'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    revisions: {
        type: [String],
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Code', schema);
