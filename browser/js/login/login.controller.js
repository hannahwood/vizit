app.controller('LoginCtrl', function ($scope, $mdDialog, AuthService, $state) {

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;
        loginInfo.email = loginInfo.email.toLowerCase();

        AuthService.login(loginInfo).then(function () {
            $mdDialog.hide();
            $state.go('home');
        }).catch(function (err) {
            $scope.error = err.message;
            $scope.login.password = '';
        });

    };
});
