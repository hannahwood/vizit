app.controller('NavCtrl', function($scope, $mdBottomSheet, $mdSidenav, $mdDialog, $state, $window, $rootScope, AuthService, AUTH_EVENTS){

  $scope.color = 'md-hue-2';
  $scope.height = '80px';

  angular.element($window).bind("scroll", function() {
    if ($window.pageYOffset > 80) {
        $scope.height = '80px';
        $scope.color = 'md-hue';
     } else {
       $scope.height = '80px';
       $scope.color = 'md-hue-2';
     }
     $scope.$apply();
  });

  $scope.currentState = function(){
    return $state.current.name
  }


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

  var removeUser = function () {
    $scope.user = null;
  };

  setUser();

  $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
  $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
  $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

  $scope.toggleSidenav = function() {
    $mdSidenav('left').toggle();
  };

  $scope.alert = '';
  $scope.showBottomSheet = function($event) {
    $scope.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'js/bottom-sheet/bottom-sheet.html',
      controller: 'BottomSheetCtrl',
      targetEvent: $event
    }).then(function(clickedItem) {
      $scope.alert = clickedItem.name + ' clicked!';
    });
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