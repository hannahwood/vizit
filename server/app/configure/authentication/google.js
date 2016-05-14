'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var querystring = require('querystring');

module.exports = function (app) {

    var googleConfig = app.getValue('env').GOOGLE;

    var googleCredentials = {
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {

        UserModel.findOne({ 'google.id': profile.id }).exec()
            .then(function (user) {

                if (user) {
                    return user;
                } else {
                    return UserModel.findOne({email: profile.emails[0].value.toLowerCase()});
                }

            })
            .then(function (potentialUser) {
                if (potentialUser) {
                    potentialUser.google.id = profile.id;
                    potentialUser.fullName = potentialUser.fullName || profile.displayName;
                    return potentialUser.save();
                } else {
                    return UserModel.create({
                        google: {
                            id: profile.id
                        },
                        fullName: profile.displayName,
                        email: profile.emails[0].value.toLowerCase(),
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

    passport.use(new GoogleStrategy(googleCredentials, verifyCallback));

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
