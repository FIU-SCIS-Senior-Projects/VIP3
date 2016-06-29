(function () {
    'use strict';

    angular
        .module('reviewRegistration',['userService'])
        .controller('reviewController', reviewController);

    reviewController.$inject = ['$state', '$scope', '$location', 'reviewRegService', 'ProfileService'];
    /* @ngInject */
    function reviewController( $state, $scope, $location, reviewRegService, ProfileService) {
        var vm = this;
        vm.profile;
        vm.acceptProfile = acceptProfile;
        vm.rejectProfile = rejectProfile;

		var profile;

		ProfileService.loadProfile().then(function(data)
		{
			if (data) {
				profile = data;
				if (profile.userType != "Pi/CoPi") {
					$location.path("/");
				}
			}
			else {
				profile = null;
				$location.path("login");
			}
		});

        init();

        function init(){
            loadData();
        }

        function loadData(){
            reviewRegService.getReg($state.params.user_id).then(function(data){
                vm.profile = data;

            });
        }

        function acceptProfile () {
            vm.profile.piApproval = true;
            console.log("piApproval set to true");
            vm.message = "User has been Accepted!";

			// if a Pi is approved, mark him in the DB as a super user, so he can switch usertypes to student/faculty/pi without approval
            if (vm.profile.userType == "Pi/CoPi")
            {
				vm.profile.isSuperUser = true;
                console.log("isSuperUser set to true");
			}

			// non-pi user must be restricted
			else
			{
				vm.profile.isSuperUser = false;
                console.log("isSuperUser set to false");
			}

            reviewRegService.acceptProfile(vm.profile).then(function(data){ });

            //alert("User Accepted!");
        }
        function rejectProfile () {
            vm.profile.piApproval = false;
            vm.profile.piDenial = true;
            vm.message = "User has been Rejected!";
            reviewRegService.rejectProfile(vm.profile).then(function(data){
            });
            //alert("User Rejected!");

        }

    }
})();
