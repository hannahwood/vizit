app.controller('SessionsController', function ($scope, code, $state, CodeFactory, $mdDialog) {
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

    $scope.delete = function (codeId, index){
        CodeFactory.removeCode(codeId)
        .then(() => {
            $scope.codes.splice(index, 1)
        })
    }

    var originatorEv;
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    $scope.openEditDialog = function($event, codeInfo, index) {
      $mdDialog.show({
        templateUrl: 'js/sessions/edit.html',
        controller: 'EditCtrl',
        clickOutsideToClose: true,
        locals: {code: codeInfo},
        targetEvent: $event
      })
      .then(function (updatedCode) {
        $scope.codes[index] = updatedCode;
      })
    };

});

app.filter( 'timefromnow', function(moment) {
        return function( input ) {
            return moment(input).fromNow()
        }
    });
