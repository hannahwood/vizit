app.controller('RunTimeCtrl', function ($scope, $rootScope) {
   $scope.compare = false;
   $scope.runTime = {
      func1Parameters: [{type: '', name: ''}],
      func2Parameters: [{type: '', name: ''}],
      formType: 'Form'
   }

   $scope.func2Params = false;

   $scope.inputTypes = ['String', 'Number', 'Array']

   $scope.addParam = function () {
      $scope.runTime.parameters.push('');
   }

   $scope.removeParam = function (index) {
      $scope.runTime.parameters.splice(index, 1);
   }
});