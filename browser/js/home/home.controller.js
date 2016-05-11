app.controller('HomeCtrl', function($scope, VisualizeCodeFactory) {
    $scope.code = '// input your code here and click on "Visualize"';
    $scope.selection = 'edit';
    $scope.submitCode = function(code) {
        // debugger;
        VisualizeCodeFactory.submitCode(code)
            .then(function(response) {
                $scope.trace = response.trace;
                return new VisualizeCodeFactory.executionVisualizer("pyOutputPane", response);
            });
    };
    $scope.set = function(selection) {
        $scope.selection = selection;
    };

});

app.directive('visualize', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/home/visualize.html'
    };
});
