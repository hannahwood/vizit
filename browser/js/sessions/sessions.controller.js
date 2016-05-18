app.controller('SessionsController', function ($scope, code, $state) {
    $scope.codes = code;
    $scope.oneAtATime = true;
    $scope.searchText;
    $scope.goToSelected = function(code){
        var revisionNum = code.revisions.length-1
        $state.go('revision', {codeId: code._id, revisionNum: revisionNum})
    }

    $scope.icon = "keyboard_arrow_right";
    $scope.clickIconMorph = function(id) {
        $scope.codes.forEach(function (c) {
          if (c.isOpen && c._id !== id) {
            c.isOpen = false;
          }
        })
        var index = $scope.codes.map(e => e._id).indexOf(id);
        $scope.codes[index].isOpen = !$scope.codes[index].isOpen;
    };

    $scope.mostRecent = function (code) {
        return Date.parse(code.revisions[code.revisions.length-1].date);
    }


});

app.filter( 'timefromnow', function(moment) {
        return function( input ) {
            return moment(input).fromNow()
        }
    });
