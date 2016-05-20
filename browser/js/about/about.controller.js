app.controller('AboutController', function($scope) {
    $scope.scroll = $("button").click(function() {
        $('html,body').animate({
                scrollTop: $(".glyphicon").offset().top
            },
            'slow');
    });
});
