
'use strict';

var Auth = {};

Auth.isAuthenticated = function (req) {
    return !!req.user;
};

Auth.isAdmin = function (req) {
    return req.user && req.user.isAdmin;
};

Auth.isSelf = function (req) {
    if (!req.requestedUser) return false;
    return req.user._id.equals(req.requestedUser._id);
};

Auth.assert = function (assertion, status) {
    return function (req, res, next) {
        if (assertion(req)) next();
        else next(new Error("Not Authenticated"));
    };
};

Auth.assertAuthenticated = Auth.assert(Auth.isAuthenticated, 401);

Auth.assertAdmin = Auth.assert(Auth.isAdmin);

Auth.assertSelf = Auth.assert(Auth.isSelf);

Auth.assertAdminOrSelf = Auth.assert(function (req) {
    return Auth.isAuthenticated(req) && (Auth.isAdmin(req) || Auth.isSelf(req));
});


module.exports = Auth;
