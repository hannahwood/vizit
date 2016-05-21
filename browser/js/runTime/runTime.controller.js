app.controller('RunTimeCtrl', function ($scope, $rootScope,$mdDialog,RuntimeFactory) {
   $scope.compare = false;
   $scope.runTime = {
      code : `function memFibonacci(n, cache) {
    cache = cache || {};
    if(cache[n]){
        return cache[n];
    } else {
        if(n <= 2) {
            return 1;
        } else {
            cache[n] = memFibonacci(n - 1, cache) + memFibonacci(n - 2, cache);
        }    
    }
    return cache[n]
}`,
      compareCode : `function fibonacci(n) {
    if(n <= 2) {
        return 1;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,
      func1 : "memFibonacci",
      func2 : "fibonacci",
      input : "10"
   };
   // $scope.runTime = {
   //    func1Parameters: [{type: '', name: ''}],
   //    func2Parameters: [{type: '', name: ''}],
   //    formType: 'Form'
   // }
   $scope.showAlert = function(ev,text) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Runtime Analysis')
        .textContent($scope.text)
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };
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
      $scope.text = $scope.results[0].name + " is " + ($scope.results[0].hz/$scope.results[1].hz).toFixed(2) + "x faster than " + $scope.results[1].name
      $scope.showAlert()
      //alert($scope.results[0].name + " is " + $scope.results[0].hz/$scope.results[1].hz + "x faster than " + $scope.results[1].name)
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