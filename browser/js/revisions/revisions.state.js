app.config(function($stateProvider){
    $stateProvider
    .state('revision', {
        url: '/code/:codeId/{revisionNum: int}',
        controller: 'RevisionCtrl',
        templateUrl: 'js/visualize/visualize.html',
        resolve: {
            revision: function (CodeFactory, $stateParams) {
                return CodeFactory.getRevision($stateParams.codeId, $stateParams.revisionNum);
            },
            code: function ($stateParams, CodeFactory) {
                return CodeFactory.getCode($stateParams.codeId);
            }
        }
    })


})

