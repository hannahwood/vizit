app.controller('SessionsController', function ($scope, code, $state) {
    $scope.codes = code;
    $scope.oneAtATime = true;
    $scope.searchText;
    $scope.goToSelected = function(code){
        var revisionNum = code.revisions.length-1
        $state.go('revision', {codeId: code._id, revisionNum: revisionNum})
    }

    $scope.icon = "keyboard_arrow_right";
    $scope.clickIconMorph = function(index) {
        $scope.codes.forEach(function (c, i) {
          if (c.isOpen && i !== index) {
            c.isOpen = false;
          }
        })
        $scope.codes[index].isOpen = !$scope.codes[index].isOpen;
    };


});

app.filter( 'timefromnow', function(moment) {
        return function( input ) {
            return moment(input).fromNow()
        }
    });
