app.controller('UserNavCtrl', function ($scope, $mdDialog, AuthService, $state, $rootScope, AUTH_EVENTS) {

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.goToNewState = function(state){
      $scope.hide();

    }

    $scope.admin = [
    {
      state : 'profile',
      title: 'Profile',
      icon: 'group'
    },
    {
      state : 'sessions',
      title: 'Sessions',
      icon: 'code'
    },
    {
      state : 'settings',
      title: 'Settings',
      icon: 'settings'
    }
  ];

  $scope.user = null;

  $scope.isLoggedIn = function () {
    return AuthService.isAuthenticated();
  };

  $scope.logout = function () {
    AuthService.logout().then(function () {
       $state.go('home');
       $scope.cancel();
    });
  };

  var setUser = function () {
    AuthService.getLoggedInUser().then(function (user) {
        $scope.user = user;
    });
  };

  var removeUser = function () {
    $scope.user = null;
  };

  setUser();

  $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
  $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
  $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);


});
