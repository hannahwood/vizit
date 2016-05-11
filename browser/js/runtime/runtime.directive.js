app.directive('runtime', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/runtime/runtime.html',
		controller: 'HomeCtrl'
	};
});


app.directive('rickshawChart', function () {
	return {
		template: '<div></div>',
		restrict: 'E',
		controller: 'HomeCtrl',
		link: function postLink(scope, element, attrs) {
			element.text('this is the rickshawChart directive');
		}
	};
});
