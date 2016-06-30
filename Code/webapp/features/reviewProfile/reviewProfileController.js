(function () {
    'use strict';

    angular
        .module('reviewProfile')
        .controller('reviewProfileController', reviewProfileController);

    reviewProfileController.$inject = ['$state', '$scope', 'reviewProfileService', '$location', '$window', 'ProfileService'];

    /* @ngInject */
    // function undefined reviewProfileService???
    function reviewProfileController($state, $scope, reviewProfileService, $location, $window, ProfileService) {        
		var profile;
		
		ProfileService.loadProfile().then(function(data){
					if (data) {
						profile = data;
                        
                        // only PI can view this page
                        if (profile.userType != "Pi/CoPi")
                        {
                            console.log("User isnt allowed to view this page");
                            $location.path("/");
                        }
					}
		});
        
        var vm = this;
        vm.profile;
        vm.acceptProfile = acceptProfile;
        vm.rejectProfile = rejectProfile;

        init();
        
        function init(){
            loadData();
        }

        function loadData(){
            	reviewProfileService.getReg($state.params.user_id).then(function(data)
            {
                vm.profile = data;
                
                console.log("Requ user = " + vm.profile.requested_userType);
                console.log("Requ rank = " + vm.profile.requested_rank);
                
                // no usertype or rank updates, so no changes to be made
                if (vm.profile.requested_rank == null && vm.profile.requested_userType == null)
                {
                    $window.location.href = "/";
                }
            });
        }

		// accepts the updated rank/usertype
        function acceptProfile ()
        {
            vm.profile.isApproved = 1;

            reviewProfileService.updateProfile(vm.profile).then(function(data)
            {
                
            });
            
            success_msg();
        }

		// rejects the rank/usertype
        function rejectProfile ()
        {
			// a decision has been made, clear the requested fields for this user
			vm.profile.userType = null;
            vm.profile.isApproved = 0;
            
            reviewProfileService.updateProfile(vm.profile).then(function(data)
            {
                
            });

            error_msg();

        }
        
        function success_msg()
         {
            swal({   
                title: "Profile Changes Accepted!",   
                text: "This users profile has been updated!",   
                type: "success",   
                confirmButtonText: "Close" ,
                allowOutsideClick: true,
                timer: 9000,
            }, function () {
                $window.location.reload();
            }
            );
        };

        function error_msg()
         {
            swal({   
                title: "Profile Changes Rejected!",   
                text: "No changes were made to this users profile!",   
                type: "error",   
                confirmButtonText: "Close" ,
                allowOutsideClick: true,
                timer: 9000,
            }
            );
        };

    }
})();
