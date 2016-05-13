app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        resolve: {
            code: function(){
                return Promise.resolve('test');
            }
        }
    });
});



