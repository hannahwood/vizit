var dbURI = 'mongodb://localhost:27017/vizitTest';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

require('../../../server/db/models')
var User = mongoose.model('User');
var Code = mongoose.model('Code');

describe('Code model', function () {

   var createdUser, createdCode;

   beforeEach('Establish DB connection', function (done) {
      if (mongoose.connection.db) return done();
      mongoose.connect(dbURI, done);
   });

   beforeEach('create a piece of code', function (done) {
      User.create({
         email: 'obama@whitehouse.gov',
         password: 'potus'
      }).then(function (user) {
         createdUser = user;
         return Code.create({
            revisions: [{
               content: 'var x = 5;\nvar y = 10;\nvar z = x+y;'
            }],
            author: createdUser._id
         })
      }).then(function (code) {
         createdCode = code;
         done();
      }).catch(done);
   });

   afterEach('Clear test database', function (done) {
      clearDB(done);
   });

   it('should exist', function () {
      expect(User).to.be.a('function');
   });

   describe('properties', function () {

      describe('author', function () {

         it('should be a reference', function (done) {
            expect(createdCode.author).to.be.ok;
            expect(createdCode.author.toString()).to.be.a('string');
            Code.findById(createdCode._id).populate('author')
            .then(function (code) {
               expect(code.author).to.be.an('object');
               expect(code.author.email).to.equal('obama@whitehouse.gov');
               done();
            }).catch(done);
         });

      });

      describe('revisions', function () {

         it('should be an array', function () {
            expect(createdCode.revisions).to.be.an('array');
         });

         it('should have content', function () {
            expect(createdCode.revisions[0]).to.have.property('content');
            expect(createdCode.revisions[0].content).to.be.ok;
            expect(createdCode.revisions[0].content).to.be.a('string');
         });

         it('should be dated', function () {
            expect(createdCode.revisions[0].date).to.be.a('date');
         });
      });

   });

   describe('updating', function () {

      it('does not include title or tags by default', function () {
         expect(createdCode.title).to.not.be.ok;
         expect(createdCode.tags).to.be.empty;
      });

      it('should allow for addition of tags', function (done) {
         createdCode.title = 'Simple Code';
         createdCode.tags.push('easy','breezy','lemon','squeezy');
         createdCode.save()
         .then(function (updatedCode) {
            expect(updatedCode.title).to.be.a('string');
            expect(updatedCode.tags).to.have.length(4);
            done();
         })
         .catch(done);
      });

   });
});