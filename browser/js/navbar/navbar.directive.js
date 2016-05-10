app.directive('navbar', function () {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/navbar/navbar.html',
        controller: 'NavCtrl'
    };
});