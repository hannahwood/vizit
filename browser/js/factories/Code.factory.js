app.factory('CodeFactory', function ($http, $q) {

    var rejectErr = err => $q.reject(err.data)
    var CodeFactory = {};

    CodeFactory.getRevision = function(codeId, revisionNum){
        return $http.get('/api/code/'+codeId)
        .then(res => res.data)
        .then(function (code) {
            return code.revisions[revisionNum];
        })
        .catch(rejectErr);
    };

    CodeFactory.getCode = function(codeId){
        return $http.get('/api/code/'+codeId)
        .then(res => res.data)
        .catch(rejectErr);
    };

    CodeFactory.saveCode = function(code, userId){
        let arr = [{content: code}];
        return $http.post('/api/code/', {revisions: arr, author: userId})
        .then(res => res.data)
        .catch(rejectErr);
    }

    CodeFactory.addRevision = function (codeId, revision) {
        let obj = {content: revision};
        return $http.put('/api/code/'+codeId, {revision: obj})
        .then(res => res.data)
        .catch(rejectErr);
    }

    CodeFactory.removeCode = function(codeId){
        return $http.delete('/api/code/'+codeId)
        .then(res => res.data)
        .catch(rejectErr);
    }

    CodeFactory.updateCode = function(codeId, updateInfo){
        return $http.put('/api/code/'+codeId, updateInfo)
        .then(res => res.data)
        .catch(rejectErr);
    }

    return CodeFactory;
});
