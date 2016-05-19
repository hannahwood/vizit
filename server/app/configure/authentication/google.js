'use strict';
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function (app) {

    var googleConfig = app.getValue('env').GOOGLE;

    var verifyCallback = function (accessToken, refreshToken, profile, done) {

        UserModel.findByEmail(profile.emails[0].value)
        .then(function (potentialUser) {
            if (potentialUser) {
                potentialUser.google.id = potentialUser.google.id || profile.id;
                potentialUser.fullName = potentialUser.fullName || profile.displayName;
                return potentialUser.save();
            } else {
                return UserModel.create({
                    google: {
                        id: profile.id
                    },
                    fullName: profile.displayName,
                    email: profile.emails[0].value
                });
            }
        })
        .then(function (userToLogin) {
            done(null, userToLogin);
        })
        .catch(function (err) {
            console.error('Error creating user from Google authentication', err);
            done(err);
        });

    };

    passport.use(new GoogleStrategy(googleConfig, verifyCallback));

    function checkReturnTo (req,res,next) {
        var returnTo = req.query.returnTo;
        if (returnTo) {
            req.session = req.session || {};
            req.session.returnTo = returnTo;
        }
        next();
    }

    app.get('/auth/google', checkReturnTo, passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { successReturnToOrRedirect: '/', failureRedirect: '/' }));

};