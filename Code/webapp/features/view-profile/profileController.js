(function () {
    'use strict';

    angular
        .module('vip-projects')
        .controller('VIPProjectsDetailedCtrl', VIPProjectsDetailedCtrl);

    VIPProjectsDetailedCtrl.$inject = ['$sce','$location','$state', '$scope', '$stateParams', 'ProjectService', 'ProfileService','reviewStudentAppService','User','$window'];

    /* @ngInject */
    function VIPProjectsDetailedCtrl($sce,$location, $state, $scope, $stateParams, ProjectService, ProfileService,reviewStudentAppService,User,$window) {
	}
});