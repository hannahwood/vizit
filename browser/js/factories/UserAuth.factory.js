app.factory('UserAuthFactory', function (AuthService, $state, $http, $q, Flash) {
  var UserAuthFactory = {};
  var parseData = res => res.data;

  UserAuthFactory.logout = function () {
    AuthService.logout().then(function () {
      $state.go('home');
    })
  };

  UserAuthFactory.updateUser = function (userId, updateInfo) {
    return $http.put('/api/users/'+userId, updateInfo)
    .then(parseData)
    .catch(function (err) {
      return $q.reject(err.data);
    });
  }

  UserAuthFactory.updatePassword = function (userId, passObj) {
    return $http.put('/api/users/'+userId+'/updatePassword', passObj)
    .then(parseData)
    .catch(function (err) {
      return $q.reject(err.data);
    })
  }

  UserAuthFactory.connect = function (user, provider) {

  }

  UserAuthFactory.disconnect = function (user, provider) {
    
  }

  return UserAuthFactory;
});
