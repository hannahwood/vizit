app.controller('UserSettingsCtrl', function ($scope, user, UserAuthFactory, Flash) {
   $scope.original = angular.extend({},user);
   $scope.user = user;
   $scope.emailDuplicate = $scope.user.email;
   $scope.open = true;
   $scope.oneAtATime = true;
   $scope.updateUser = function (userInfo) {
      delete userInfo.__v;
      var update = {};
      Object.keys(userInfo).forEach(function (k) {
         if (!$scope.original[k] || userInfo[k] !== $scope.original[k]) {
            update[k] = userInfo[k];
         }
      })

      UserAuthFactory.updateUser(user._id, update)
      .then(function (updatedUser) {
         $scope.original = angular.extend({},updatedUser)
         $scope.user = updatedUser;
         $scope.emailDuplicate = $scope.user.email;
      })
   }

   $scope.passwordSuccess = function (updatedUser) {
      var message = '<strong>Your password has been updated</strong>';
      Flash.create('success', message);
      $scope.user = updatedUser;
   }

   $scope.passwordError = function (err) {
      var message = '<strong>'+err+'</strong>';
      Flash.create('danger', message);
      $scope.user = $scope.original;
   }

   $scope.updatePassword = function (userId, oldPassword, newPassword) {
      UserAuthFactory.updatePassword(userId, oldPassword, newPassword)
      .then($scope.passwordSuccess)
      .catch($scope.passwordError);
   }
})