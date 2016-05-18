app.factory('UserAuthFactory', function ($http, $q) {
  var parseData = res => res.data;
  var rejErr = err => $q.reject(err.data);
  var UserAuthFactory = {};

  UserAuthFactory.updateUser = function (userId, updateInfo) {
    return $http.put('/api/users/'+userId, updateInfo)
    .then(parseData)
    .catch(rejErr);
  }

  return UserAuthFactory;
});
