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

      it('should get a 403 response if not logged in', function (done) {
         guestAgent.get('/api/users/')
            .expect(403)
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

         it('should still get a 403 response accessing all users', function (done) {
            loggedInAgent.get('/api/users/')
            .expect(403)
            .end(done);
         })
      })

   });

   describe('Authenticated login', function () {
      var loggedInAgent;

      var userInfo = [{
            email: 'neilpatrickharris@himym.com',
            password: 'legendary',
            isAdmin: true
         }, {
            email: 'alfred@bat.cave',
            password: 'whatarecomputers'
         }]

      beforeEach('Create users', function (done) {
         User.create(userInfo, done);
      })

      describe('as admin', function () {

         beforeEach('Create loggedIn user agent and authenticate', function (done) {
            loggedInAgent = supertest.agent(app);
            loggedInAgent.post('/login').send(userInfo[0]).end(done);
         });

         it('can access all users', function (done) {
            loggedInAgent.get('/api/users/')
            .expect(200)
            .end(done);
         })

      })

      describe('as non-admin', function () {

         beforeEach('Create loggedIn user agent and authenticate', function (done) {
            loggedInAgent = supertest.agent(app);
            loggedInAgent.post('/login').send(userInfo[1]).end(done);
         });

         it('can access user info', function (done) {
            User.findOne({email: 'alfred@bat.cave'})
            .then(function (alfred) {
               loggedInAgent.get(`/api/users/${alfred._id}`)
               .expect(200)
               .end(done);
            })
            .catch(done);
         })

         describe('can update', function () {

            it('user info', function (done) {
               User.findOne({email: 'alfred@bat.cave'})
               .then(function (alfred) {
                  expect(alfred.email).to.equal('alfred@bat.cave');
                  loggedInAgent.put(`/api/users/${alfred._id}`)
                  .send({email: 'alfred@batcave.wayne'})
                  .end(function (err, res) {
                     expect(res.body.email).to.equal('alfred@batcave.wayne');
                     done();
                  });
               })
               .catch(done);
            })

            it('user password', function (done) {
               User.findOne({email: 'alfred@bat.cave'})
               .then(function (alfred) {
                  loggedInAgent.put(`/api/users/${alfred._id}`)
                  .send({oldPassword: 'whatarecomputers', password: 'computer'})
                  .expect(201)
                  .end(done);
               })
               .catch(done);
            })
         })

         it('can delete themself', function (done) {
            User.findOne({email: 'alfred@bat.cave'})
            .then(function (alfred) {
               loggedInAgent.del(`/api/users/${alfred._id}`)
               .expect(204)
               .end(done);
            })
            .catch(done);
         })

      })
   })

});