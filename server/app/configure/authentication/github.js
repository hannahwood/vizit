'use strict';

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function (app) {

   var githubConfig = app.getValue('env').GITHUB;

   var githubCredentials = {
      clientID: githubConfig.clientID,
      clientSecret: githubConfig.clientSecret,
      callbackURL: githubConfig.callbackURL
   };

   var verifyCallback = function (accessToken, refreshToken, profile, done) {

      UserModel.findOne({ 'github.id': profile.id }).exec()
      .then(function (user) {
         if (user) {
            return user;
         } else {
            return UserModel.create({
               github: {
                  id: profile.id
               }
            })
         }
      })
      .then(function (userToLogin) {
         done(null, userToLogin);
      })
      .catch(function (err) {
         console.error('Error creating user from GitHub authentication', err);
         done(err);
      });
   }

   passport.use(new GitHubStrategy(githubCredentials, verifyCallback));

   app.get('/auth/github', passport.authenticate('github'));

   app.get('/auth/github/callback', passport.authenticate('github'), function (req, res) {
      res.redirect('/');
   });

}