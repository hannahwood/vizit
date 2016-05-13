app.factory('CodeFactory', function ($http) {
    var CodeFactory = {};

    CodeFactory.getRevision = function(codeId, revisionNum){
        return $http.get('/api/code/'+codeId)
        .then(res => res.data)
        .then(function (code) {
            return code.revisions[revisionNum];
        })
    };

    CodeFactory.getCode = function(codeId){
        return $http.get('/api/code/'+codeId)
        .then(res => res.data)
    };


    return CodeFactory;
});
