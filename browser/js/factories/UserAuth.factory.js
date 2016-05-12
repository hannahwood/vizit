app.factory('UserAuthFactory', function (AuthService, $state, $http, $q) {
    var UserAuthFactory = {};
    var parseData = res => res.data;

    UserAuthFactory.logout = function () {
        AuthService.logout().then(function () {
            $state.go('home');
        })
    };

   UserAuthFactory.updateUser = function (userId, updateInfo) {
      return $http.put('/api/users/'+userId, updateInfo)
      .then(parseData);
   }

   UserAuthFactory.updatePassword = function (userId, oldPassword, newPassword) {
      return $http.put('/api/users/'+userId+'/updatePassword', {oldPassword: oldPassword, newPassword: newPassword})
      .then(parseData)
      .catch(function (err) {
         console.log(err);
         return $q.reject(err.data);
      })
   }

   return UserAuthFactory;
});
