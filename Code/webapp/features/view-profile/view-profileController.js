(function () {
    'use strict';

    angular
        .module('vip-projects')
        .controller('viewProfileController', viewProfile);

    viewProfile.$inject = ['$sce','$location','$state', '$scope', '$stateParams', 'ProjectService', 'ProfileService','reviewStudentAppService','User','$window'];
    /* @ngInject */

    function viewProfile($sce,$location, $state, $scope, $stateParams, ProjectService, ProfileService,reviewStudentAppService,User,$window){
    	var vm = this;
    	vm.profile = null;

    	if ($stateParams.user_id)
    	{
    		User.get($stateParams.user_id).then(function(res){
    			vm.profile = res.data;
    		})
    	}

    }

})();