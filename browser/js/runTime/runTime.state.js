app.config(function ($stateProvider) {
   $stateProvider.state('runtime', {
      url: '/runtime',
      templateUrl: 'js/runTime/runTime.html',
      controller: 'RunTimeCtrl'
   })
})