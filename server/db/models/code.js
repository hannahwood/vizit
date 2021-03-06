'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    revisions: [{
        content: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    tags: [String]
});



mongoose.model('Code', schema);
