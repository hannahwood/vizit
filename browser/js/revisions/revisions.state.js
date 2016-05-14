// app.config(function($stateProvider){

//     $stateProvider.state('code', {
//         url: '/code/:codeId',
//         abstract: true,
//         controller: function($state, code){
//             $state.go('code.revision', {
//                 codeId: code._id,
//                 revisionNum: code.revisions[code.revisions.length-1]
//             })
//         },
//         resolve: {
//             code: function($stateParams, CodeFactory){
//                 return CodeFactory.getCode($stateParams.codeId)
//             }
//         }
//     })

// })

app.config(function($stateProvider){

    $stateProvider.state('revision', {
        url: '/:codeId/{revisionNum: int}',
        controller: 'RevisionCtrl',
        templateUrl: 'js/revisions/revisions.html',
        resolve: {
            revision: function (CodeFactory, $stateParams) {
                return CodeFactory.getRevision($stateParams.codeId, $stateParams.revisionNum);
            }
        }
    })

})

