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

    CodeFactory.saveCode = function(code, userId){
        let arr = [{content: code}];
        return $http.post('/api/code/', {revisions: arr, author: userId})
        .then(res => res.data)
    }

    CodeFactory.addRevision = function (codeId, revision) {
        let obj = {content: revision};
        return $http.put('/api/code/'+codeId, {revision: obj})
        .then(res => res.data);
    }

    return CodeFactory;
});
