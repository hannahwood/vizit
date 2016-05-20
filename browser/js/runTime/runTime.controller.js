app.controller('RunTimeCtrl', function ($scope, $rootScope, RuntimeFactory) {
   $scope.compare = false;
   $scope.runTime = {
      code : "function foo(n){return n*n}",
      compareCode : "function bar(n){return n? bar(n-1)*n : 1}",
      func1 : "foo",
      func2 : "bar",
      input : "5"
   };
   // $scope.runTime = {
   //    func1Parameters: [{type: '', name: ''}],
   //    func2Parameters: [{type: '', name: ''}],
   //    formType: 'Form'
   // }
   $scope.submit = function(params){
     $scope.progress = true;
     $scope.hasError = false;
     if (!$scope.compare) {
      delete params.compareCode;
      delete params.func2;
   }
   return RuntimeFactory.submit(params)
   .then(function(response){
      $scope.results = response.sort((a,b) => b.hz > a.hz)
      console.log($scope.results)
      $scope.progress = false;
   }).catch(function(err) {
     $scope.hasError = true;
     $scope.progress = false;
  });
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