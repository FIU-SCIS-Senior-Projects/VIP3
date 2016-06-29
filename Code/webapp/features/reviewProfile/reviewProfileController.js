(function () {
    'use strict';

    angular
        .module('reviewProfile')
        .controller('reviewProfileController', reviewProfileController);

    reviewProfileController.$inject = ['$state', '$scope', 'reviewProfileService'];

    /* @ngInject */
    // function undefined reviewProfileService???
    function reviewProfileController($state, $scope, reviewProfileService) {
        var vm = this;
        vm.profile;
        vm.acceptProfile = acceptProfile;
        vm.rejectProfile = rejectProfile;

        init();
        function init(){
            loadData();
        }

        function loadData(){
            	reviewProfileService.getReg($state.params.user_id).then(function(data){
                vm.profile = data;
            });
        }

		// accepts the updated rank/usertype
        function acceptProfile ()
        {
            vm.message = "Profile changes Accepted!";
            
			// dont update the profile
            reviewProfileService.acceptProfile(vm.profile).then(function(data){
            });
            
            setTimeout(function () { location.reload(true); }, 2000);
        }

		// rejects the rank/usertype
        function rejectProfile ()
        {
			// a decision has been made, clear the requested fields for this user
			vm.profile.userType = null;

            vm.message = "Profile changes Rejected!";

            setTimeout(function () { location.reload(true); }, 2000);

        }

    }
})();
