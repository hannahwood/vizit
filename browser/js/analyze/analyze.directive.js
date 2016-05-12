app.directive('analyze', function () {
	return {
		restrict: 'E',
		template: '<div></div>',
		scope: {
			data: '=',
			renderer: '='
		},
		link: function(scope, element, attrs) {
			scope.$watchCollection('[data, renderer]', function(newVal, oldVal){
				debugger;
				if(!newVal[0]){
					return;
				}
				element[0].innerHTML ='';
				var graph = new Rickshaw.Graph({
					element: element[0],
					width: attrs.width,
					height: attrs.height,
					series: [{data: scope.data, color: attrs.color}],
					renderer: scope.renderer
				});
				graph.render();
			});
		}

	};
});

