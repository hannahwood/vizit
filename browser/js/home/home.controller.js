app.filter( 'titlecase', function() {
        return function( input ) {
            return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }
    });

app.controller('HomeCtrl', function($scope, VisualizeCodeFactory, AuthService, $rootScope, CodeFactory, $state) {
    $scope.code = '// input your code here and click on "Visualize"\
    \nfunction fact(n) {\
  \nif (n == 0) {\
    \n   return 1;\
  \n}\
  \nelse {\
    \n   console.log("THERE ARE  " + n + " oranges!!!");\
    \n   return n * fact(n-1);\
  \n}\
\n}\
\n\nfact(10);'

	$scope.render = VisualizeCodeFactory.executionVisualizer.renderDataStructures;

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

    $scope.user;

    AuthService.getLoggedInUser().then(function (user) {
        $scope.user = user;
    });

    $rootScope.$on('loggedOut', function(){
        $scope.user = null;
    });

    $scope.save = function(code){
        CodeFactory.saveCode(code, $scope.user._id)
        .then(code => $state.go('revision', {codeId: code._id, revisionNum: 0}));
    }

});

app.directive('visualize', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/home/visualize.html'
    };
});
