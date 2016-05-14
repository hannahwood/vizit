app.directive('main', function () {
    return {
        restrict: 'E',
        scope: { code: '='},
        templateUrl: 'js/home/main.html'
    };
});
