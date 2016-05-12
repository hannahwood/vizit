app.controller('SessionsController', function ($scope, code, $state) {
    $scope.codes = code;
    $scope.oneAtATime = true;
    $scope.searchText;
    $scope.goToSelected = function(code){
        var revisionNum = code.revisions.length-1
        $state.go('revision', {codeId: code._id, revisionNum: revisionNum})
    }
    $scope.isOpen = false;
    $scope.icon = "keyboard_arrow_right";
    $scope.clickIconMorph = function($index) {
        $scope.isOpen = true;
        if ($scope.icon === "keyboard_arrow_right") {
            $scope.icon = "keyboard_arrow_down";
            $scope.isOpen = true;
        }
        else {
            $scope.icon = "keyboard_arrow_right";
            $scope.isOpen = false;
        }

    };

});

app.filter( 'timefromnow', function(moment) {
        return function( input ) {
            return moment(input).fromNow()
        }
    });
