app.controller('UserSettingsCtrl', function ($scope, user, UserAuthFactory, Flash, $rootScope, $mdToast, $document) {
   $scope.user = user;
   $scope.open = true;
   $scope.oneAtATime = true;
   $scope.update = {};
   $scope.pass = {};

   function passwordSuccess () {
      $mdToast.show($mdToast.simple()
         .content('Your password has been updated')
         .position('top right')
         .parent($document[0].querySelector('#password')));
      $scope.pass = {};
   }

   function passwordFail (err) {
      $mdToast.show($mdToast.simple()
         .content(err)
         .position('top left')
         .parent($document[0].querySelector('#password')));
      $scope.pass = {};
   }

   function userSuccess (updatedUser) {
      $mdToast.show($mdToast.simple()
         .content('Your information has been updated')
         .position('top right')
         .parent($document[0].querySelector('#account')));
      $rootScope.$emit('userUpdated', updatedUser._id);
      $scope.user = updatedUser;
      $scope.update = {};
   }

   function userError (err) {
      $mdToast.show($mdToast.simple()
         .content(err)
         .position('top left')
         .parent($document[0].querySelector('#account')));
      $scope.user = $scope.original;
      $scope.update = {};
   }

   $scope.updateUser = function (userInfo) {
      delete userInfo.emailDuplicate;
      var update = {};

      Object.keys(userInfo).forEach(function (k) {
         if (userInfo[k]) {
            update[k] = userInfo[k];
         }
      })

      UserAuthFactory.updateUser($scope.user._id, update)
      .then(userSuccess)
      .catch(userError);
   }

   $scope.updatePassword = function (passObj) {
      UserAuthFactory.updatePassword($scope.user._id, passObj)
      .then(passwordSuccess)
      .catch(passwordFail);
   }

   $scope.disconnect = function (provider) {
      UserAuthFactory.disconnect($scope.user, provider)
      .then(function (updatedUser) {
         $scope.user = updatedUser;
      })
      .catch(function (err) {
         Flash.create('danger', '<strong>'+err+'</strong>',5000,{id: 'connect'}, true);
         $scope.user = $scope.original;
      })
   }
})