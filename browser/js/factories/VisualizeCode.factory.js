app.factory('VisualizeCodeFactory', function($http) {
  return {
    submitCode: function(code) {
      $http.post('/api/pt/exec_js', {user_script: code})
      .then(function(data) {
        console.log(data);
        return data;
      });
    }
  };
});