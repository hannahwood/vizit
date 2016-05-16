app.controller('NavCtrl', function($scope, $mdBottomSheet, $mdSidenav, $mdDialog, $state, $window, $rootScope, AuthService, AUTH_EVENTS){

  // height of navbar
  $scope.height = '50px';

  // current state
  $scope.currentState = function(){
    return $state.current.name
  }

  // morphing user settings icon
  $rootScope.$on('toggledUserNav', function(){
    $scope.clickIconMorph();
  });

  $scope.icon = "menu";
  $scope.clickIconMorph = function() {
    if ($scope.icon === "menu") {
        $scope.icon = "clear";
    }
    else {
        $scope.icon = "menu";
    }
  };

  $scope.user = null;

  $scope.isLoggedIn = function () {
    return AuthService.isAuthenticated();
  };

  $scope.logout = function () {
    AuthService.logout().then(function () {
       $state.go('home');
    });
  };

  var setUser = function () {
    AuthService.getLoggedInUser().then(function (user) {
        $scope.user = user;
    });
  };

  var updateUser = function (userId) {
    AuthService.updateUser(userId).then(function (user) {
      $scope.user = user;
    })
  }

  var removeUser = function () {
    $scope.user = null;
    $rootScope.$emit('loggedOut');
  };

  setUser();


  $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
  $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
  $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
  $rootScope.$on('userUpdated', function (e, userId) {
    AuthService.updateUser(userId).then(function (user) {
      $scope.user = user;
    })
  });

  $scope.alert = '';

  $scope.showUserMenu = function(ev) {
    $mdDialog.show({
      controller: 'UserNavCtrl',
      templateUrl: 'js/usernav/usernav.html',
      targetEvent: ev,
      clickOutsideToClose: true,
      openFrom: '#usernav',
      closeTo: '#usernav',
      hasBackdrop: false
    })
  };

  $scope.showLogin = function(ev) {
    $mdDialog.show({
      controller: 'LoginCtrl',
      templateUrl: 'js/login/login.html',
      targetEvent: ev,
      clickOutsideToClose: true,
      openFrom: '#login',
      closeTo: '#login'
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  };

  $scope.showSignUp = function(ev) {
    $mdDialog.show({
      controller: 'SignUpCtrl',
      templateUrl: 'js/signup/signup.html',
      targetEvent: ev,
      clickOutsideToClose: true,
      openFrom: '#signup',
      closeTo: '#signup'
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  };
});
