(function () {
    'use strict';

    angular
        .module('main-page')
        .controller('homeController', homeController);

    homeController.$inject = ['$state', '$scope'];

    /* @ngInject */

    function homeController($state, $scope) {
        $scope.image = [{
            src: 'image/poster.png'
        }];
    }
})();
