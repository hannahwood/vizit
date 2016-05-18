app.controller('EditCtrl', function ($scope, $mdDialog, CodeFactory, code, $mdConstant) {

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.code = code;
    $scope.updateInfo = {};
    Object.keys($scope.code).forEach(k => {
        if (k === 'title' || k === 'tags') $scope.updateInfo[k] = $scope.code[k];
    })

    $scope.updateSession = function(){
        CodeFactory.updateCode($scope.code._id, $scope.updateInfo)
        .then(function (updatedCode) {
            $mdDialog.hide(updatedCode);
        })
    }
    console.log($mdConstant.KEY_CODE);
    $scope.space = [$mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.SPACE, $mdConstant.KEY_CODE.TAB];


});
