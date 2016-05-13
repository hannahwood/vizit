app.factory('UserAuthFactory', function (AuthService, $state, $http, $q, Flash) {
  var UserAuthFactory = {};
  var parseData = res => res.data;
  var rejErr = err => $q.reject(err.data);

  UserAuthFactory.logout = function () {
    AuthService.logout().then(function () {
      $state.go('home');
    })
  };

  UserAuthFactory.updateUser = function (userId, updateInfo) {
    return $http.put('/api/users/'+userId, updateInfo)
    .then(parseData)
    .catch(rejErr);
  }

  UserAuthFactory.updatePassword = function (userId, passObj) {
    return $http.put('/api/users/'+userId+'/updatePassword', passObj)
    .then(parseData)
    .catch(rejErr)
  }

  UserAuthFactory.disconnect = function (userId, provider) {
    return $http.put('/api/users/'+userId+'/disconnectProvider', {provider: provider})
    .then(parseData)
    .catch(rejErr)
  }

  return UserAuthFactory;
});
