app.factory('UserAuthFactory', function (AuthService, $state) {
    var UserAuthFactory = {};

    UserAuthFactory.logout = function () {
        AuthService.logout().then(function () {
            $state.go('home');
        })
    }

    return UserAuthFactory;
});
