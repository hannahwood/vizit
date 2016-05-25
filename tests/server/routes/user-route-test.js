var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Code = mongoose.model('Code');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/vizitTest';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Members Route', function () {

   beforeEach('Establish DB connection', function (done) {
      if (mongoose.connection.db) return done();
      mongoose.connect(dbURI, done);
   });

   afterEach('Clear test database', function (done) {
      clearDB(done);
   });

   describe('Unauthenticated request', function () {

      var guestAgent;

      beforeEach('Create guest agent', function () {
         guestAgent = supertest.agent(app);
      });

      it('should get a 401 response if not an admin', function (done) {
         guestAgent.get('/api/users/')
            .expect(401)
            .end(done);
      });

      describe('as logged in non-admin', function () {
         var loggedInAgent;

         var userInfo = {
            email: 'neilpatrickharris@himym.com',
            password: 'legendary'
         };

         beforeEach('Create a user', function (done) {
            User.create(userInfo, done);
         });

         beforeEach('Create loggedIn user agent and authenticate', function (done) {
            loggedInAgent = supertest.agent(app);
            loggedInAgent.post('/login').send(userInfo).end(done);
         });

         it('should still get a 401 response', function (done) {
            loggedInAgent.get('/api/users/')
            .expect(401)
            .end(done);
         })
      })

   });

});