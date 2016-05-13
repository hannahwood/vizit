app.factory('UserFactory', function ($state, $http) {
    var UserFactory = {};

    UserFactory.getAllTheCodez = function (userId) {
        return $http.get('/api/users/'+ userId + '/code')
        .then(res => res.data)
    }

    return UserFactory;
})
