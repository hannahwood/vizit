app.factory('RuntimeFactory', function ($http, $q) {
	var RuntimeFactory = {};

	RuntimeFactory.submit = function(options) {
		return $http.post('/api/runTime', options)
		.then(function(response) {
			return response.data;
		}).catch(function(err){
			return $q.reject(err.data);
		})
	}
	return RuntimeFactory;
});
