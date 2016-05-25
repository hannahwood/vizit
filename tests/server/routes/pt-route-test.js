var mongoose = require('mongoose');
var User = mongoose.model('User');
var Code = mongoose.model('Code');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/vizitTest';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');