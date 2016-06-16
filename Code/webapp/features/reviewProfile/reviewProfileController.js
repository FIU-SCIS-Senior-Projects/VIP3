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
			// update the profile
            reviewProfileService.acceptProfile(vm.profile).then(function(data){
            });

            alert("User's Rank / User Type have been updated!");
        }

		// rejects the rank/usertype
        function rejectProfile ()
        {
			// a decision has been made, clear the requested fields for this user
			vm.profile.requested_rank = null;
			vm.profile.userType = null;

            reviewProfileService.rejectProfile(vm.profile).then(function(data){
            });

            alert("Rejected this users Rank/User Type Request!");

        }

    }
})();
