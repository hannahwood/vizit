app.config(function ($stateProvider) {
   $stateProvider.state('settings', {
      url: '/settings',
      templateUrl: 'js/userSettings/userSettings.html',
      controller: 'UserSettingsCtrl',
      resolve: {
         user: function (AuthService) {
            return AuthService.getLoggedInUser();
         }
      }
   })
})