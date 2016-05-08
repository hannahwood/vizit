'use strict';
window.app = angular.module('FullstackGeneratedApp', ['fsaPreBuilt', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'ngMaterial', 'ngAria', 'ngMdIcons']);

app.config(function ($urlRouterProvider, $locationProvider, $mdThemingProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });
    $mdThemingProvider.definePalette('neon', {
      '50'  : 'FAFAFA',
      '100' : 'F5F5F5',
      '200' : 'EEEEEE',
      '300' : 'E0E0E0',
      '400' : 'BDBDBD',
      '500' : '9E9E9E',
      '600' : '757575',
      '700' : '616161',
      '800' : '424242',
      '900' : '212121',
      'A100': 'FFEB3B',
      'A200': 'FFEB3B',
      'A400': 'FFEB3B',
      'A700': 'FFEB3B',
      'contrastDefaultColor': 'dark',    // whether, by default, text (contrast)
                                          // on this palette should be dark or light
      'contrastDarkColors': undefined,
      'contrastLightColors': ['600', '700', '800', '900']   // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('neon', {
        'default': '100'
         // use shade 50 for default, and keep all other shades the same
      });
});


// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function (state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });

    });

});
