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

        reviewRegService.getReg($state.params.user_id).then(function(data)
        {
            vm.profile = data;
        });

        function acceptProfile () {
			loading();
            vm.profile.piApproval = true;
            vm.profile.isDecisionMade = true;
            vm.profile.__v = 1;
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

            success_msg();
        }
        
        function rejectProfile () {
			loading();
            vm.profile.piApproval = false;
            vm.profile.piDenial = true;
            vm.profile.isDecisionMade = true;
            vm.profile.__v = 2;
            
            vm.message = "User has been Rejected!";
            reviewRegService.rejectProfile(vm.profile).then(function(data){
            });
            reject_msg();

        }
		
		function loading() {
			swal({   
               title: '',
			   text: 'Loading Please Wait...',
			   html: true,
			   timer: 10000,   
			   showConfirmButton: false
            }
            );
		}

        function success_msg()
         {
            swal({   
                title: "Accepted",   
                text: "User has been accepted and notified",   
                type: "info",   
                confirmButtonText: "Continue" ,
                allowOutsideClick: true,
                timer: 7000,
            }
            );
        };

        function reject_msg()
         {
            swal({   
                title: "User Rejected",   
                text: "User has been denied and notified",   
                type: "warning",   
                confirmButtonText: "Continue" ,
                allowOutsideClick: true,
                timer: 7000,
            }
            );
        };

    }
})();