app.directive('navbar', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        controller: 'NavCtrl'
    };

});

app.directive('sidenav', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/sidenav.html',
        controller: 'SideNavCtrl'
    };

});

app.controller('NavCtrl', function($scope, $mdBottomSheet, $mdSidenav, $mdDialog, $state, $window, $rootScope, AuthService, AUTH_EVENTS){

  $scope.userName = 'Hannah';
  $scope.avatar = '/assets/users/user1.jpg';

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
      templateUrl: 'js/common/directives/bottom-sheet/bottom-sheet.html',
      controller: 'BottomSheetCtrl',
      targetEvent: $event
    }).then(function(clickedItem) {
      $scope.alert = clickedItem.name + ' clicked!';
    });
  };

  $scope.showSignUp = function(ev) {
    $mdDialog.show({
      controller: 'SignUpController',
      templateUrl: 'js/common/directives/signup/signup.html',
      targetEvent: ev,
      clickOutsideToClose: true,
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  };
});

app.controller('BottomSheetCtrl', function($scope, $mdBottomSheet) {
  $scope.items = [
    { name: 'Share', icon: 'share' },
    { name: 'Upload', icon: 'upload' },
    { name: 'Copy', icon: 'copy' },
    { name: 'Print this page', icon: 'print' },
  ];

  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
});

app.controller('SignUpController', function($scope, $mdDialog, AuthService, $state) {


  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
  $scope.login = {};
  $scope.error = null;

  $scope.sendLogin = function (loginInfo) {

      $scope.error = null;

      AuthService.login(loginInfo).then(function () {
          $state.go('home');
      }).catch(function () {
          $scope.error = 'Invalid login credentials.';
      });

      $mdDialog.hide();

  };
});



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


app.controller('HomeCtrl', function($scope, VisualizeCodeFactory){
  $scope.code = {};
  $scope.submitCode = VisualizeCodeFactory.submitCode;
});


app.factory('VisualizeCodeFactory', function($http) {
  return {
    submitCode: function(code) {
      $http.post('/api/pt/exec_js', {user_script: code})
      .then(function(data) {
        console.log(data);
        return data;
      });
    }
  };
});








