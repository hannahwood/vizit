app.factory('UserFactory', function ($state, $http, $q) {
   var UserFactory = {};
   var parseData = res => res.data;
   var rejectErr = err => $q.reject(err.data);

   UserFactory.getAllTheCodez = function (userId) {
      return $http.get('/api/code', {params: {author: userId}})
      .then(parseData)
      .then(codes => codes.map(code => {
         code.isOpen = false;
         return code;
      }))
      .catch(rejectErr);
   }

   UserFactory.updateUser = function (userId, updateInfo) {
      return $http.put('/api/users/'+userId, updateInfo)
      .then(parseData)
      .catch(rejectErr);
   }

   return UserFactory;
})
