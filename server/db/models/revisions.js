'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    revisions: {
        type: [String],
        required: true
    }
});

mongoose.model('Revisions', schema);
