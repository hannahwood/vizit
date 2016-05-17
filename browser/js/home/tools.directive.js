app.directive('tools', function () {
    return {
        restrict: 'E',
        scope: { options: '='},
        templateUrl: 'js/home/tools.html'
    };
});
