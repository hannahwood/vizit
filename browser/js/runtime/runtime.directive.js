app.directive('runtime', function () {
	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'js/runtime/runtime.html',
		controller: 'RuntimeCtrl'
	};
});


app.directive('rickshawChart', function () {
	return {
		template: '<div></div>',
		restrict: 'E',
		link: function postLink(scope, element, attrs) {
			element.text('this is the rickshawChart directive');
		}
	};
});
