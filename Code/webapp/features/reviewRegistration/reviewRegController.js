(function () {
    'use strict';

    angular
        .module('reviewRegistration')
        .controller('reviewController', reviewController);

    reviewController.$inject = ['$state', '$scope', 'reviewRegService'];
    /* @ngInject */
    function reviewController($state, $scope, reviewRegService) {
        var vm = this;
        vm.profile;
        vm.acceptProfile = acceptProfile;
        vm.rejectProfile = rejectProfile;

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

            reviewRegService.acceptProfile(vm.profile).then(function(data){
            });
            alert("User Accepted!");
        }
        function rejectProfile () {
            vm.profile.piApproval = false;
            vm.profile.piDenial = true;
            reviewRegService.rejectProfile(vm.profile).then(function(data){
            });
            alert("User Rejected!");

        }

    }
})();
