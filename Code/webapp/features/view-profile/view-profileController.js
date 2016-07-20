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
		vm.current_user = null;
		vm.done = false;

    	if ($stateParams.user_id && $stateParams.project_id)
    	{
    		User.get($stateParams.user_id).then(function(res){
				ProfileService.loadProfile().then(function(data){
					if (data) {
						vm.current_user = data;
						var project = null;
						ProjectService.getProject($stateParams.project_id).then(function(d) {
						project = d;
						if (vm.current_user.userType == 'Pi/CoPi' 
						|| vm.current_user.userType == 'Staff/Faculty' 
						|| project.members.includes(vm.current_user.email)) {
							vm.profile = res.data;
							if (!vm.profile) {
								$state.go('viewProfile');
							}
							vm.done = true;
						}
						else {
							$state.go('viewProfile');
						}
							
							
						});
						
					}
					else {
						$window.sessionStorage.setItem('lr', 'userprofile/' + $stateParams.user_id + '/' + $stateParams.project_id);
						$state.go('login');
					}
				});
    		})
    	}
		else {
			
			$state.go('home');
		}

    }

})();