app.controller('SideNavCtrl', function($scope, $mdSidenav, $state, $rootScope, AuthService, AUTH_EVENTS){

  $scope.userName = 'Hannah';
  $scope.avatar = '/assets/users/user1.jpg';

  $scope.icon = "clear";
  $scope.clickIconMorph = function() {
    if ($scope.icon === "clear") {
        $scope.icon = "menu";
    }
    else {
        $scope.icon = "clear";
    }
  };

  $scope.toggleSidenav = function() {
    $mdSidenav('left').toggle();
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

  $scope.menu = [
    {
      link : '',
      title: 'Dashboard',
      icon: 'dashboard'
    },
    {
      link : '',
      title: 'Friends',
      icon: 'group'
    },
    {
      link : '',
      title: 'Messages',
      icon: 'message'
    }
  ];
  $scope.admin = [
    {
      link : '',
      title: 'Trash',
      icon: 'delete'
    },
    {
      link : 'showListBottomSheet($event)',
      title: 'Settings',
      icon: 'settings'
    }
  ];

});