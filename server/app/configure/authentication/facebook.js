'use strict';
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function (app) {

    var facebookConfig = app.getValue('env').FACEBOOK;

    var facebookCredentials = {
        clientID: facebookConfig.clientID,
        clientSecret: facebookConfig.clientSecret,
        callbackURL: facebookConfig.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'emails']
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {
        
        UserModel.findOne({ 'facebook.id': profile.id }).exec()
            .then(function (user) {

                if (user) {
                    return user;
                } else {
                    return UserModel.findOne({email: profile.emails[0].value});
                }

            })
            .then(function (potentialUser) {
                if (potentialUser) {
                    potentialUser.facebook.id = profile.id;
                    potentialUser.fullName = potentialUser.fullName || profile.displayName;
                    potentialUser.photo = potentialUser.photo || profile.photos[0].value;
                    return potentialUser.save();
                } else {
                    return UserModel.create({
                        google: {
                            id: profile.id
                        },
                        fullName: profile.displayName,
                        email: profile.emails[0].value,
                        photo: profile.photos[0].value
                    });
                }
            })
            .then(function (userToLogin) {
                done(null, userToLogin);
            })
            .catch(function (err) {
                console.error('Error creating user from Facebook authentication', err);
                done(err);
            })

    };

    passport.use(new FacebookStrategy(facebookCredentials, verifyCallback));

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

};