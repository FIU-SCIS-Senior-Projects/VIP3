(function() {
    angular.module('vipFooter', [])
        .directive('vipFooter', function () {
            return {
                templateUrl: 'features/footer/footerTemplate.html',
                restrict: 'E' // Can be used as HTML element or as an attribute
            };
        });
}());